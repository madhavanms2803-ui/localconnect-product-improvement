# LocalConnect Product Improvements

## Product purpose
LocalConnect helps residents share neighborhood information, communicate,
and report local problems.

## Existing features reviewed
- Neighborhood feed for posts and announcements.
- Local issue reporting and status updates.
- Dashboard with community metrics.
- Assigned tasks and task completion.
- Contributor leaderboard using hard-coded example names and scores.

## Product mismatches
Assigned tasks, activity scores, and a competitive leaderboard make the
experience feel like workplace productivity software. They do not directly
help residents discover announcements or track neighborhood problems.

## Changes implemented
- Reworked the dashboard around neighborhood updates and reported issues.
- Removed Tasks and Leaders from the main application navigation and routes.
- Added searchable neighborhood posts.
- Added issue search by title and description.
- Added issue status filters for Open, In Progress, and Resolved.
- Added issue status summaries, input limits, loading feedback, and
  success and error messages.
- Retained the existing post and issue API endpoints and database models.
- Kept legacy task files in the repository rather than deleting them.

## Value to residents
Residents can find relevant neighborhood announcements more quickly and
filter reported issues by their content and current status. The main
application now prioritizes community communication over workplace-style
productivity.

## Deployment links
- Frontend: Pending deployment.
- Backend API: Pending deployment.
- Hosted PostgreSQL: Pending configuration.
