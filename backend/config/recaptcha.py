from google.oauth2 import service_account
from google.cloud import recaptchaenterprise_v1
from google.cloud.recaptchaenterprise_v1 import Assessment


def get_recaptcha_client(key_path: str) -> recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient:
    """Create and return a reCAPTCHA Enterprise client with loaded credentials."""
    # Load credentials from the JSON key file
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    # Create a client using the loaded credentials
    client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient(credentials=credentials)
    return client

def create_assessment(
    project_id: str, recaptcha_key: str, token: str, recaptcha_action: str, key_path: str
) -> Assessment:
    """Create an assessment to analyze the risk of a UI action.
    Args:
        project_id: Your Google Cloud Project ID.
        recaptcha_key: The reCAPTCHA key associated with the site/app
        token: The generated token obtained from the client.
        recaptcha_action: Action name corresponding to the token.
    """

    # client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient()
    client = get_recaptcha_client(key_path)

    # Set the properties of the event to be tracked.
    event = recaptchaenterprise_v1.Event()
    event.site_key = recaptcha_key
    event.token = token

    assessment = recaptchaenterprise_v1.Assessment()
    assessment.event = event

    project_name = f"projects/{project_id}"

    # Build the assessment request.
    request = recaptchaenterprise_v1.CreateAssessmentRequest()
    request.assessment = assessment
    request.parent = project_name

    response = client.create_assessment(request)

    # Check if the token is valid.
    if not response.token_properties.valid:
        print(
            "The CreateAssessment call failed because the token was "
            + "invalid for the following reasons: "
            + str(response.token_properties.invalid_reason)
        )
        return

    # Check if the expected action was executed.
    if response.token_properties.action != recaptcha_action:
        print(
            "The action attribute in your reCAPTCHA tag does"
            + "not match the action you are expecting to score"   
        )
        return
    else:
        # Get the risk score and the reason(s).
        # For more information on interpreting the assessment, see:
        # https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        for reason in response.risk_analysis.reasons:
            print(reason)
        print(
            "The reCAPTCHA score for this token is: "
            + str(response.risk_analysis.score)
        )
        # Get the assessment name (id). Use this to annotate the assessment.
        assessment_name = client.parse_assessment_path(response.name).get("assessment")
        print(f"Assessment name: {assessment_name}")
    return response

