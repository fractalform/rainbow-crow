// app/data/community.ts
//
// Everything community-facing that changes often lives here so it's
// one obvious edit. When the Discord server exists, paste the invite
// URL below and the Community page lights up automatically.
//
// Events used to live here as a static array — they've since moved to
// content/events/*.md (a proper content collection, same pattern as
// the blog) so each event can have its own page. Add a new event by
// creating a new .md file in content/events/, not by editing this file.

export const discordInvite: string | null = null
// e.g. export const discordInvite = 'https://discord.gg/yourcode'

// Google Calendar embed — paste the "Embed code" src URL (see README
// for where to find it). Leave null to hide the calendar block.
export const googleCalendarEmbedUrl: string | null = null
// e.g. export const googleCalendarEmbedUrl =
//   'https://calendar.google.com/calendar/embed?src=your_calendar_id%40group.calendar.google.com&ctz=America%2FNew_York'
