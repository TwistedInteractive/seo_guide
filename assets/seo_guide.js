// Words to exclude from the single word count:
var seoGuideExcludes = [
    'the', 'a', 'i', 'and', 'of', 'to',
    'de', 'het', 'een',
    'le', 'la'
];


var seoGuideFields = [];
var seoGuideIntervalID;
var seoKeywords = [];

jQuery(function($) {
    $("div.field-seo_guide").symphonyCollapsible({
        items:   '.instance',
        handles: '.header'
    });

    // Make references to the objects that are listened upon (for optimization, use jQuery as less as possible):
    for (var i = 0; i < seoGuideFields.length; i++) {
        seoGuideFields[i][2] = $("#field-" + seoGuideFields[i][0] + " input, #field-" + seoGuideFields[i][0] + " textarea")[0];
        // CKEditor compatibility:
        seoGuideFields[i][3] = $(seoGuideFields[i][2]).hasClass("ckeditor");
    }

    $("div.field-seo_guide input").change(function(){
        seoKeywords = $(this).val().toLowerCase().split(' ');
    }).change();

    $("div.field-seo_guide a.keywords").click(function(){
        $("div.field-seo_guide li.keywords div.content").show();
        return false;
    });

    $("div.field-seo_guide a.help").click(function(){
        return false;
    });

    seoGuideAnalyzeText();
    seoGuideIntervalID = setInterval('seoGuideAnalyzeText()', 1000);

});

function seoGuideAnalyzeText() {
    var startTime   = new Date();
    var allWords    = {};
    var dictionary1 = {};
    var dictionary2 = {};
    var dictionary3 = {};
    var count = 0;

    for (var i = 0, j = seoGuideFields.length; i < j; i++) {
        var elem = seoGuideFields[i][2];
        var prio = seoGuideFields[i][1];
        // CKEditor compatibility:
        var value;
        if(seoGuideFields[i][3] == true)
        {
            value = '';
            for(instanceName in CKEDITOR.instances)
            {
                if(instanceName == elem.name)
                {
                    var editor = CKEDITOR.instances[instanceName];
                    var data = editor.getData().replace("\n", '');
                    value = data.toLowerCase().replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                    // If words are in H1, they get a prio of +2
                    // If words are in H2, they get a prio of +1
                    var h1s = data.match(/<h1\b[^>]*>(.*?)<\/h1>/gmi);
                    var h2s = data.match(/<h2\b[^>]*>(.*?)<\/h2>/gmi);
                    for(var h in h1s)
                    {
                        var text = h1s[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 2, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 2, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 2, 3);
                    }
                    for(var h in h2s)
                    {
                        var text = h2s[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 1, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 1, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 1, 3);
                    }
                }
            }
        } else {
            value = elem.value.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
        }

        if (value != '') {
            // Get the individual words:
            var words = value.split(' ');
            var wordsLength = words.length;
            count += wordsLength;
            dictionary1 = appendDictionary(dictionary1, words, prio, 0);
            dictionary2 = appendDictionary(dictionary2, words, prio, 2);
            dictionary3 = appendDictionary(dictionary3, words, prio, 3);
            allWords    = appendDictionary(allWords, words, 1, 0);
        }
    }

    document.getElementById('total-words').textContent = count;

    // Sort the objects:
    var dic1 = sortObj(dictionary1);
    var dic2 = sortObj(dictionary2);
    var dic3 = sortObj(dictionary3);

    document.getElementById('unique-words').textContent = dic1.length;

    var html1 = '';
    var html2 = '';
    var html3 = '';

    var keyWordsInDictionary = 0;

    for(var i = 0; i < 5; i++)
    {
        if(dic1[i] != undefined) {
            html1 += '<li>' + dic1[i][0] + ' <em>(' + dic1[i][1] + ')</em></li>';
            if(in_array(dic1[i][0], seoKeywords))
            {
                keyWordsInDictionary += (5-i);
            }
        }
        if(dic2[i] != undefined) {
            html2 += '<li>' + dic2[i][0] + ' <em>(' + dic2[i][1] + ')</em></li>';
            if(in_array3(dic2[i][0], seoKeywords))
            {
                keyWordsInDictionary += (5-i);

            }
        }
        if(dic3[i] != undefined) {
            html3 += '<li>' + dic3[i][0] + ' <em>(' + dic3[i][1] + ')</em></li>';
            if(in_array3(dic3[i][0], seoKeywords))
            {
                keyWordsInDictionary += (5-i);
            }
        }
    }

    document.getElementById('most-important-one').innerHTML = html1;
    document.getElementById('most-important-two').innerHTML = html2;
    document.getElementById('most-important-three').innerHTML = html3;

    // Do the analysis:
    // First, check if all keywords are at least used in the text. This is the first 25% of SEO ranking.
    // Second, check if the used keywords are at least in the top 5 of each dictionary. This is 45% of the SEO ranking (3 × 15), 15 = 1,2,3,4,5
    // Third, check if the keywords do not ocupy more then 3% of the total content. This is the last 30%. 2% for each keyword. If the keyword occurs more than 3% in the content, it is considered a penalty.

    var percent        = 0;
    var keyWordsLength = seoKeywords.length;
    var keyWordsFound  = 0;
    var eachPercent    = 25 / keyWordsLength;
    var spamPercent    = 0;
    for(var i in seoKeywords)
    {
        if(in_array2(seoKeywords[i], dic1))
        {
            keyWordsFound++;
            percent += eachPercent;

            // Check how many times this word occurs:
            spamPercent += allWords[seoKeywords[i]] / count;
        }
    }

    document.getElementById('keywords-saturation').textContent = Math.round(spamPercent * 100) + '%';

    // 3% is best = 30%
    // 2% = 20%
    // 1% = 10%
    // 0% = 0%
    // 4% = 20%
    // 5% = 10%
    // 6% = 0%
    // > 6% = penalty, 1% for each percent.

    var saturationBonus = 30;
    if(spamPercent <= 0.03)
    {
        saturationBonus -= (30 - (spamPercent * 10));
    } else if(spamPercent > 0.03 && spamPercent <= 0.06) {
        saturationBonus -= (((spamPercent * 100) - 3) * 10);
    } else if(spamPercent > 0.06) {
        saturationBonus = -((spamPercent * 100) - 6);
    }

    console.log(saturationBonus);

    percent += keyWordsInDictionary;
    percent += saturationBonus;
    if(percent < 0) { percent = 0; }
    if(percent > 100) { percent = 100; }

    document.getElementById('keywords-usage').textContent = keyWordsFound + ' / ' + keyWordsLength;
    document.getElementById('keywords-importance').textContent = Math.round(keyWordsInDictionary * 2.22) + '%';
    document.getElementById('seo-strength').textContent = Math.round(percent) + '%';

    var endTime = new Date();
    var diff    = endTime.getTime() - startTime.getTime();
    document.getElementById('execution-time').textContent = diff + ' ms';
}

function appendDictionary(dictionary, words, prio, plus)
{
    words = cleanArray(words);
    if(!plus) { plus = 0; }
    if(plus == 0)
    {
        var newWords = [];
        for(var i in words)
        {
            if(!in_array(words[i], seoGuideExcludes))
            {
                newWords.push(words[i]);
            }
        }
        words = newWords;
    }
    var wordsLength = words.length;
    for (var k = 0; k < wordsLength - plus; k++) {
        var key = words[k];
        if(plus == 2) { key += ' ' + words[k + 1]; }
        if(plus == 3) { key += ' ' + words[k + 1] + ' ' + words[k + 2]; }
        if (key != '') {
            if (dictionary[key] == undefined) {
                dictionary[key] = prio;
            } else {
                dictionary[key] += prio;
            }
        }
    }
    return dictionary;
}

function cleanArray(arr)
{
    newArray = [];
    for(var i in arr)
    {
        if(arr[i] != '')
        {
            newArray.push(arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
        }
    }
    return newArray;
}

function sortObj(obj) {
    var sortable = [];
    for (var i in obj) {
        sortable.push([i, obj[i]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    return sortable;
}

function in_array (needle, haystack) {
    var key = '';
    for (key in haystack) {
        if (haystack[key] == needle) {
            return true;
        }
    }
    return false;
}

function in_array2 (needle, haystack) {
    var key = '';
    for (key in haystack) {
        if (haystack[key][0] == needle) {
            return true;
        }
    }
    return false;
}

function in_array3 (needle, haystack) {
    var key = '';
    for (key in haystack) {
        if (needle.indexOf(haystack[key][0]) != -1) {
            return true;
        }
    }
    return false;
}