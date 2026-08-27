# AI Focus Hub

Build: AI Workplace Productivity Assistant

Build a modern, responsive, frontend-only web application called AI Workplace Productivity Assistant.

The application is a productivity tool designed to help professionals plan their work, research information, and interact with an AI workplace assistant.

🚨 IMPORTANT ARCHITECTURE REQUIREMENT

This must be a frontend-only application.

DO NOT create or require:

User login

Sign-up or registration

Authentication

User accounts

Passwords

User profiles

Backend services

Database

Server-side application

Persistent cloud storage

Supabase

Firebase

Any external database

Any requirement to save user information

The user must be able to open the application and immediately start using it.

There should be no login screen or onboarding requiring personal information.

All functionality should work entirely within the browser.

Use local React state / in-memory state for application interactions. Data can reset when the page is refreshed; persistent storage is not required.

If AI functionality requires an API, structure the application with a clean frontend AI service abstraction and use mock/demo AI responses by default so the application works without a backend or API key.

Do not expose API keys or secrets in the frontend.

Design Direction

Create a clean, modern and professional SaaS-style interface inspired by contemporary productivity and AI platforms.

Use the attached screenshot as visual inspiration for the layout, spacing, styling and overall visual hierarchy.

Do not copy the screenshot exactly. Create an original interface with a similar level of polish.

Colour palette

Use primarily:

Light blue

Dark/navy blue

White

Very light blue/grey

Subtle blue gradients

Blue should be the primary accent colour.

The interface should include:

Rounded cards

Subtle shadows

Clean spacing

Modern typography

Consistent icons

Clear visual hierarchy

Smooth but subtle animations

Professional corporate aesthetic

Application Layout

Create a responsive application with:

Desktop

A fixed/persistent dark navy sidebar on the left and the main application content on the right.

Mobile

Convert the sidebar into a hamburger/mobile navigation menu.

Navigation items:

Dashboard

AI Task Planner

Research Assistant

AI Assistant

My Tasks

Saved Research

Settings

Important: Settings should contain application preferences only(light/dark mode). Do not include account, profile, password or personal information settings.

1. Dashboard

Create a polished productivity dashboard.

The user should immediately see:

Welcome section

Use a generic greeting such as:

Good morning 👋

Let's make today productive.

Do not use the user's name or request their personal information.

Display the current date dynamically.

Productivity overview

Include cards such as:

Today's Tasks

8 Total

3 Completed

3 In Progress

2 Pending

Productivity Score

82%

Upcoming

Show upcoming tasks

AI Activity

Recent AI actions

Quick Actions

Provide prominent buttons:

Plan My Day

Create Weekly Schedule

Research a Topic

Ask AI

Each button should navigate to the relevant feature.

2. AI Task Planner

Create an AI-powered task planning interface.

Task Input

Allow the user to add tasks without creating an account.

Fields:

Task name

Description

Priority

Deadline

Estimated duration

Priority:

High

Medium

Low

Allow multiple tasks to be added.

AI Actions

Include:

Generate Daily Plan

Generate Weekly Plan

The AI should analyse the entered tasks and generate a logical schedule based on:

Priority

Deadline

Estimated duration

Task dependencies

Available working hours

Schedule Output

Display the generated schedule using a clean timeline/calendar layout.

Example:

Today

09:00 – 10:00
Review project requirements

10:00 – 10:30
Team meeting

10:30 – 12:00
Development work

12:00 – 13:00
Break

13:00 – 14:00
Prepare presentation

Allow the user to:

Complete tasks

Edit tasks

Delete tasks

Change priority

Regenerate the schedule

3. AI Research Assistant

Create a dedicated research workspace.

Input

Provide a large text area where users can:

Enter a research topic

Ask a research question

Paste an article

Paste text

Example placeholder:

"Enter a topic, question, or paste an article you'd like me to analyse..."

Actions

Provide buttons:

Summarize

Key Points

Generate Insights

Recommendations

Explain Simply

Generate Questions

AI Output

Display structured results:

Summary

AI-generated summary.

Key Insights

Insight

Insight

Recommendations

Recommendation 1

Recommendation 2

Considerations

Potential limitations, risks or areas requiring further investigation.

Include:

Copy button

Regenerate button

Save button

Saved research should exist only in temporary browser/application state and does not need to survive a refresh.

4. AI Workplace Assistant

Create a modern conversational AI interface.

The chatbot should feel like an intelligent workplace assistant rather than a generic chatbot.

Suggested prompts

Display useful suggestions such as:

"Help me plan my day"

"Prioritise my tasks"

"Summarise this information"

"Help me prepare for a meeting"

"Create a project plan"

"Write a professional email"

Chat interface

Include:

User messages

AI responses

Typing/loading animation

Message input

Send button

Clear conversation button

The responses should feel realistic and contextually relevant to the user's prompt.

5. My Tasks

Create a task-management interface.

Include:

Task list

Add task

Search

Filtering

Priority

Status

Due date

Completion checkbox

Statuses:

Not Started

In Progress

Completed

Priorities:

High

Medium

Low

All task information should remain in frontend state only.

6. Saved Research

Create a simple page showing research the user has saved during the current session.

Each saved item should show:

Research title

Date/time

Summary

Tags

Allow:

View

Delete

Search

Make it clear that saved research is temporary and is not stored on a server.

7. Settings

Create application-only settings.

Include:

Appearance

Light mode

Dark mode

System preference

AI Preferences

Response length

Response style

Default AI behaviour

Productivity

Default working hours

Default task priority

Do not include:

Account settings

Email

Password

Profile

Login

Registration

Responsible AI

Include a visible Responsible AI disclaimer.

Use:

Responsible AI

AI-generated responses may contain inaccuracies or outdated information. Review and verify important information before making professional, financial, legal or business decisions. Avoid entering confidential or sensitive company information.

Also make it clear that this application does not store user information on a server.

Frontend AI Demonstration

Since this application has no backend, create a realistic AI simulation for demonstration purposes.

When a user submits a request:

Show a loading/typing state.

Process the request using frontend logic.

Display the response in a polished AI response component.

Create several response templates based on the type of request.

For example:

If the user asks to plan their day, generate a structured schedule.

If the user asks for a summary, generate a structured summary.

If the user asks for recommendations, generate recommendations.

If the user asks a general workplace question, provide a helpful workplace-oriented response.

Privacy & Data Handling

The application must be designed with privacy in mind.

No information should be sent to or stored on a backend.

Do not collect:

Names

Email addresses

Passwords

Company information

Personal profiles

Do not require users to create accounts.

All data should remain within the current browser session/application state.

Include a small privacy message:

"No account required. Your information is processed within this application and is not stored on a server."

Responsive Design

The application must work beautifully on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Sidebar becomes a hamburger menu

Cards become single-column

Forms become full width

Schedule becomes a vertical timeline

Chat interface fills available width

Buttons remain touch-friendly

UX Requirements

Include:

Loading states

Empty states

Error states

Success notifications

Form validation

Tooltips

Confirmation dialogs where appropriate

Smooth transitions

Helpful placeholder text

Do not overwhelm the user with unnecessary UI elements.

The interface should feel intuitive enough that a new user can understand it immediately.

Important Product Requirement

The application should feel like a real AI productivity SaaS product, while remaining completely frontend-only.

The user should be able to:

Open the application

Immediately access the dashboard

Add tasks

Generate schedules

Research topics

Chat with the AI assistant

Save research during the session

Manage tasks

Change application preferences

without ever logging in, registering, providing an email address, or creating an account.

The final result should be polished enough to demonstrate to a recruiter, employer, client or stakeholder as an AI Workplace Productivity Assistant prototype/MVP.

Focus on:

Modern UI + excellent UX + AI interaction + responsive design + privacy + zero backend dependency.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9764d7e6-64c6-47f8-90d2-659335d7cf10).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
