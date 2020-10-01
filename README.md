# Wipe Facebook Activity

1. Go to https://www.facebook.com/<your_profile>/allactivity
2. Open devtools and use code from src.js in the console.
3. The process will take a while (every action takes 500ms). Using a value below 500ms usually breaks the requests.

I'm using 'let', because it's easier to debug than 'const' in devtools. This script uses generated CSS classes so it will probably break after few days :)

This script removes:
- likes,
- comments,
- posts, 
- polls answers

This script hides: 
- friendship requests,

This script won't remove:
- events,
- your currently set profile picture

