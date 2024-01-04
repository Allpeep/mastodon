= Configuration File Options for AllPeep tools

Edit these options in the file /.env.production.

LIMITED_FEDERATION_MODE: set to true if it's a private community (e.g no federation)

Hide Navigation Items (from /config/environments/development|production.rb)

    'HIDE_NAV_ITEM_HOME'
    'HIDE_NAV_ITEM_NOTIFICATIONS'
    'HIDE_NAV_ITEM_EXPLORE'
    'HIDE_NAV_ITEM_SEARCH'
    'HIDE_NAV_ITEM_LOCAL'
    'HIDE_NAV_ITEM_FEDERATED'
    'HIDE_NAV_ITEM_DIRECT'
    'HIDE_NAV_ITEM_FAVOURITES'
    'HIDE_NAV_ITEM_BOOKMARKS'
    'HIDE_NAV_ITEM_LISTS'
    'HIDE_NAV_ITEM_PREFERENCES'
    'HIDE_NAV_ITEM_ABOUT'

= Instructions for creating an AllPeep theme

* create .scss file and folder in /app/javascript/styles
* add the theme to /config/themes.yml - and remove any extra ones you don't want people to use
* update the mailer.scss file to include the variables from your custom theme.
* add the name of the theme to /config/locales/en.yml

= Images Folders for images to replace

* /app/javascript/icons - phone icons
* /app/javascript/images - svg files, mailer icons
* /app/javscript/images/mailer/ - for email
* public/favicon.ico
* public/badge.png
* public/avatars/original/missing.png
* /public/brand/ - add a logo file in here to use on the front end

= Tweak texts

=== /config/locales/en.yml

Add your theme name to "themes:" section.

  sign_up:
    preamble : With an account on this AllPeep server, you'll be able to follow any other person on the network, regardless of where their account is hosted.

=== /app/javascript/mastodon/locales/en.json

    "about.powered_by": "Decentralized social media powered by {mastodon}",

    "closed_registrations.other_server_instructions":"Since AllPeep is decentralized, you can create an account on another server and still interact with this one.",

    "closed_registrations_modal.description": "Creating an account on {domain} is currently not possible, but please keep in mind that you do not need an account specifically on {domain} to use AllPeep."

    "closed_registrations_modal.title": "Signing up on AllPeep",

    "compose_form.placeholder": "What's on your mind?",

    "home.actions.go_to_local": "See all posts",

    "home.explore_prompt.title": "This is your home within this AllPeep community.",

    "onboarding.compose.template": "Hello #Peeps!",

    "onboarding.share.message": "I'm {username} on #AllPeep! Come follow me at {url}",

    "onboarding.start.lead": "You're now part of AllPeep,a decentralized community platform where you—not an algorithm—curate your own experience. Let's get you started on this new social frontier:",

    "onboarding.steps.follow_people.body": "Following interesting people can make your AllPeep experience richer.",

    "onboarding.steps.setup_profile.body": "Boost your interactions by having a comprehensive profile.",

    "onboarding.tips.accounts_from_other_servers":"<strong>Did you know?</strong> Since AllPeep connects with ActivityPub, some profiles you come across will be hosted on servers other than yours. And yet you can interact with them seamlessly! Their server is in the second half of their username!",

    "onboarding.tips.migration": "<strong>Did you know?</strong> If you feel like {domain} is not a great server choice for you in the future, you can move to another ActivityPub server without losing your followers. You can even host your own server!",

    "onboarding.tips.verification": "<strong>Did you know?</strong> You can verify your account by putting a link to your AllPeep profile on your own website and adding the website to your profile.",

    "server_banner.introduction": "{domain} is part of the decentralized social network powered by {mastodon}.",`

== Other Misc Stuff to deal with

If the server isn't going to be federated, then you need to swap the links in the file
`/app/javascript/mastodon/features/home_timeline/components/explore_prompt.tsx`
so that they don't go to the explore page.

