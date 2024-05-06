import random
import click
from flask.cli import with_appcontext
from models.tasks import TaskModel, task_user_association
from models.users import UserModel
from faker import Faker
from datetime import timedelta


def create_task(title, description, status, created_by, start, end, assigned_users):
    task = TaskModel(
        title=title,
        description=description,
        status=status,
        created_by=created_by,
        start=start,
        end=end
    )
    
    for user_id in assigned_users:
        assigned_user = UserModel.get_first(id=user_id)
        if assigned_user:
            assigned_user.tasks.append(task)
    task.save()


@click.command()
@click.option('--max_tasks_per_user', default=10, help='Maximum number of tasks per user')
@click.option('--max_users_per_task', default=5, help='Maximum number of users per task')
@click.option('--min_total_tasks', default=1000, help='Minimum total number of tasks to generate')
@with_appcontext
def generatetasks(max_tasks_per_user, max_users_per_task, min_total_tasks):
    total_tasks = 0
    fake = Faker()
    while total_tasks < min_total_tasks:
        title = fake.sentence()
        description = fake.paragraph()
        status = random.choice(['START', 'PAUSE', 'IN_PROGRESS', 'DONE', 'CLOSE'])
        start = fake.date_time_this_year()
        random_days = random.randint(1, 365)
        end = start + timedelta(days=random_days)  
        
        # Determine the number of users to assign to the task
        random_num_users_per_task = random.randint(1, max_users_per_task)
        assigned_user_ids = []
        for _ in range(random_num_users_per_task):
            row_number = random.randint(1, UserModel.query.count())
            user_id = UserModel.query.with_entities(UserModel.id).offset(row_number - 1).first()
            if user_id:
                assigned_user_ids.append(user_id[0])
        
        # Select one of the assigned users to be the creator of the task
        created_by = random.choice(assigned_user_ids)
        
        for user in assigned_user_ids:
            user_task_count = TaskModel.query.filter(TaskModel.users.any(id=user_id)).count()
            while user_task_count >= max_tasks_per_user:
                # If the user already has the maximum number of tasks, find a new random user
                row_number = random.randint(1, UserModel.query.count())
                new_user_id = UserModel.query.with_entities(UserModel.id).offset(row_number - 1).first()
                if new_user_id[0] not in assigned_user_ids:  # Ensure the new user is not already assigned
                    assigned_user_ids.remove(user_id)  # Remove the current user
                    assigned_user_ids.append(new_user_id[0])  # Add the new user
                    break
    
        create_task(title, description, status, created_by, start, end, assigned_user_ids)
        
        total_tasks += 1
        if total_tasks >= min_total_tasks:
            break  # Break the loop if the total number of tasks reaches or exceeds the minimum requirement
    click.echo("Tasks generated successfully.")


    
@click.command()
@with_appcontext
def deletealltasks():
    """
    Delete all rows from the tasks table.
    """
    from models.tasks import TaskModel
    try:
        # Get all tasks and delete them one by one
        tasks = TaskModel.query.all()
        for task in tasks:
            # Remove associations with users from the association table
            task.users.clear()
            # Delete the task
            task.delete()
        click.echo("All tasks deleted successfully.")
    except Exception as e:
        TaskModel.query.session.rollback()
        click.echo(f"Error deleting tasks: {str(e)}")