# SG-Gruppe-13
Repository for SG-Gruppe-13 - IBE160 Programmering med KI.


SETUP:

1. Create '.env.local' in SG-Gruppe-13\sentiabot and populate it with:
    NEXT_PUBLIC_SUPABASE_URL="https://qbsafyvbewcsxhfmicfb.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2FmeXZiZXdjc3hoZm1pY2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTk2MTQsImV4cCI6MjA4MDA3NTYxNH0.mnnBK7wrFdmC-yfLGJEoz3xR5lfQ1CHpZJhNl3CMWZ0"

    GEMINI_API_KEY="Your_Gemini_API_Key"

    Make sure each variable is at its own line! If you get errors related to "invalid source map", "SupabaseURL is required", "missing API key", etc. Then your .env.local file is setup incorrectly, or in the wrong directory!

        Change "Your_Gemini_API_Key" with your own Gemini API key. DO NOT share this key with anyone - it uses your billing if you have billing set up!

    NOTE: You NEED a "Tier 1 Paid" key. No payment is required, only billing to be setup.

        How to setup an API key: https://ai.google.dev/gemini-api/docs/api-key
        Where to upgrade to tier 1: https://ai.google.dev/gemini-api/docs/billing 

2. Open up your terminal and change the directory to where you downloaded the application and into Sentiabot.
        \SG-Gruppe-13\sentiabot

3. Run: 'npm install' for the dependencies.

4. Run: 'npm run dev' to start the server.

5. Open the following links:
        Main website: http://localhost:3000/
        Admin page, to add/edit/remove contexts from the database: http://localhost:3000/admin/knowledge-base
            !!!WARNING!!! IF YOU USE THE PROVIDED SUPABASE URL/KEY, THE ITEMS HERE ARE SHARED AMONG ALL WHO USE IT!
            DO NOT DELETE ANY ITEMS. YOU MAY CREATE, EDIT AND DELETE *YOUR OWN* ENTRIES AS YOU WISH.
            !!!DELETIONS ARE IRREVERSABLE!!!

Currently the knowledgebase is small and limited, but showcases what it is capable of.

On the chatbot page:

    Select your subject and grade.

Here is what you can ask the chatbot based on grade:
    
    Biology:
        Grade 1: Bear
        Grade 2: Snowowl
        Grade 3: Lynx
        Grade 4: Red fox
        Grade 5: Snow Mouse
        Grade 6: Photosynthesis
        Grade 7: DNA

    Geology:
        Grade 1: Erosion
        Grade 2: Earthquake
        Grade 3: Volcano
        Grade 4: Rocks
        Grade 5: The Earth
        Grade 6: Fossils
        Grade 7: Geothermic energi