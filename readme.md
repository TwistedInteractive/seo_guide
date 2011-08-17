# SEO Guide #

A SEO Guide for Symphony Content Editors

## What this extension does ##

This extension allows you do a real-time SEO-check on the content you are editing. It counts the unique words, and shows
which keywords and combinations occur the most in your text.

## How does it work? ##

In your section editor, you can check which fields should be monitored for text input. This could be fields that are
used for headers, descriptions, content, etc... For each field you can set a priority on how heavy this item should be
counted in the whole equation. For example: a header which will be used for a title, page handle and a big bold text on
top of the page is far more important than a small piece of text that is shown in the sidebar.

For richtext-editors CKEditor is supported.

## Important notes ##

### For Developers ###

This extension does absolutely nothing on the frontend to improve the SEO of your website. It's still the developers
responsibility to craft the correct HTML that gets indexed by the different search engines out there.

### For Content Editors ###

This extension gives absolutely no guarantee to higher search results. It only analyzes the content you are typing and
shows which keywords (and combinations) on your site are most-used and will probably be detected as 'important keywords'
for the different search engines out there.

Having said that, how any search engine exactly works since the search
algorithms used by companies as Google, Yahoo and Microsoft are known to be one of the biggest secrets in the universe.
However, this extensions gives you an insight on how the content of your website could be interpreted when analyzed by
an automated process.

## The used algorithm ##

The algorithm that this extensions used is fairly simple. It works by the following rules:

 - Count all unique words. Also count all unique word-combinations (of two and three words).
 - Give the unique words a score based on how many times they occur in the text. The score is based on the priority given to the field. Priority 1 is +1, priority 5 is +5.
 - Order these words and show the 5 words / combinations which occur the most.
 - For CKEditor: words in h1 get a +2 bonus, words in h2 get a +1 bonus.
 - The SEO strength is determined by the following:
   - First 25%: Check if all keywords are used at least once.
   - Next 45%: Check if all keywords occur in the top-5 of Words and Importance
   - Last 30%: Check if the saturation of keywords is not too high. Too much keywords could be seen as spam by some search engines. Also, it keeps the text human-readable. 3% is best. More than 6% results in a penalty.

