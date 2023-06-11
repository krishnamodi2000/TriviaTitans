# MULTICLOUD SERVERLESS COLLABRATIVE TRIVIA CHALLENGE GAME


## Trivia Titans


* *Date Created*: 11 Jun 2023
* *Last Modification Date*: 11 Jun 2023

## Authors

1. [Guru Kiran Jagata](gkiran@dal.ca)
2. [Krina Rajeshkumar Mistry](kr981143@dal.ca) 
3. [Krishna Modi](kr733081@dal.ca)
4. [Prabhleen Kaur](pr894105@dal.ca) 
5. [Rutvik Joshi](rutvik.j@dal.ca) 

### Front end

Build Using Flask. More details will be added on implementation!

### Back end

#### 1. User Authentication: Prabhleen Kaur
* Sign up and log in using social media accounts or email addresses
* Password recovery and reset if provided by the cloud service
* Register the second factor (3 pre-defined questions and answers) to the NoSQL database, and run a code to access and validate the question answers.

##### Required cloud services (Justification needed for the services used):

Option 1: [1st factor] AWS Cognito + [2nd factor] Firestore (for storing Q&A) + Cloud Function (Q&A validation)

Option 2: [1st factor] GCP - Firebase Authentication + [2nd factor] DynamoDB (for storing Q&A) + AWS Lambda (Q&A validation)

#### 2. User Profile Management: Krina Mistry
* Edit personal information (e.g. profile picture, name, and contact information etc.)
* View user statistics (e.g., games played, win/loss ratio, and total points earned)
* View and manage team affiliations
* View and compare achievements with other users

##### Required cloud services (Justification needed for the services used):

Option 1: GCP – Firestore + Cloud Functions

Option 2: AWS – DynamoDB + Lambda Functions

#### 3. Team Management (Includes usage of AI): Rutvik Joshi
* Create a team with AI (artificial intelligence) generated team name //Including a 3rd party using API
* Invite other users to join the team // sending invitation using Pub/Sub
* Accept or decline team invitations // sending acknowledgement using Pub/Sub
* View team statistics (e.g., games played, win/loss ratio, and total points earned)
* Manage team members (e.g., promote to admin, remove members, or leave the team)

##### Required cloud services (Justification needed for the services used):

Option 1: GCP – Firestore + Cloud Functions + Pub/Sub + ChatGPT (Open AI)

Option 2: AWS – DynamoDB + Lambda Functions + SQS + SNS + ChatGPT (Open AI)

#### 4. Trivia Game Lobby: Guru Kiran Jagata

* Browse and join available trivia games created by administrators
* Filter trivia games by category, difficulty level, or time frame
* View game details, such as the number of participants, time remaining, and a short description

##### Proposed cloud services (Justification needed for the services used):

AWS – DynamoDB || Lambda Functions || SQS || SNS || GCP – Firestore || Cloud Functions || Pub/Sub

#### 7. Trivia Content Management (Administrators): Krishna Modi
* Add, edit, and delete trivia questions, including category and difficulty level
* Create and manage trivia games with custom settings (e.g., categories, difficulty levels, and time frames)
* Monitor and analyze gameplay data and user engagement

##### Proposed cloud services (Justification needed for the services used):

AWS – DynamoDB || Lambda Functions || SQS || SNS || GCP – Firestore || Cloud Functions || Pub/Sub || AWS
QuickSight || Looker Studio



