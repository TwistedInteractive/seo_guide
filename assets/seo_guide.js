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
    // TODO: nog werkend maken:
/*
    $("div.field-seo_guide ol").symphonyCollapsible({
        items:   '.instance',
        handles: 'header:first'
    });
*/

    // Make references to the objects that are listened upon (for optimization, use jQuery as less as possible):
    for (var i = 0; i < seoGuideFields.length; i++) {
        seoGuideFields[i][2] = $("#field-" + seoGuideFields[i][0] + " input, #field-" + seoGuideFields[i][0] + " textarea")[0];
        // CKEditor compatibility:
        seoGuideFields[i][3] = $(seoGuideFields[i][2]).hasClass("ckeditor");
    }

/*
    $("div.field-seo_guide input").change(function(){
        seoKeywords = $(this).val().toLowerCase().split(' ');
    }).change();
*/

    // Keywords are found from the tag list:
    if(seoKeywordsFieldId != false)
    {
        $('#field-'+seoKeywordsFieldId+' input').change(function(){
            seoKeywords = $(this).val().toLowerCase().split(/,\s+|,/);
        }).change();
    }

    $("div.field-seo_guide a.keywords").click(function(){
        $("div.field-seo_guide li.keywords div.content").show();
        return false;
    });

    $("div.field-seo_guide a.help").click(function(){
        return false;
    });

    if(seoGuideFields.length != 0)
    {
        seoGuideAnalyzeText();
        seoGuideIntervalID = setInterval('seoGuideAnalyzeText()', 1000);
    }
    // setTimeout('seoGuideAnalyzeText()', 1000);
});

function seoGuideAnalyzeText() {
    var startTime   = new Date();
    var allWords    = {};
    var dictionary1 = {};
    var dictionary2 = {};
    var dictionary3 = {};
    var count = 0;
    var h1Count = 0;
    var h2Count = 0;
    var h3Count = 0;
    var strongCount = 0;
    var italicCount = 0;
    var bonus = 0;

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
                    // decode numeric entities:
                    data = data.replace(/&#([^\s]*);/g, function(match, match2) {return String.fromCharCode(Number(match2));});
                    value = data.toLowerCase().replace(/<\S[^><]*>/g, '').replace(/[^\-\w\s]|_/g, '').replace(/\s+/g, ' ');
                    // If words are in H1, they get a prio of +3
                    // If words are in H2, they get a prio of +2
                    // If words are in H3, they get a prio of +1
                    // If words are in bold/italic, they get a prio of +1
                    var h1s = data.match(/<h1\b[^>]*>(.*?)<\/h1>/gmi);
                    var h2s = data.match(/<h2\b[^>]*>(.*?)<\/h2>/gmi);
                    var h3s = data.match(/<h3\b[^>]*>(.*?)<\/h3>/gmi);
                    var bolds = data.match(/<(strong|b)\b[^>]*>(.*?)<\/(strong|b)>/gmi);
                    var italics = data.match(/<(em|i)\b[^>]*>(.*?)<\/(em|i)>/gmi);
                    for(var h in h1s)
                    {
                        var text = h1s[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 3, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 3, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 3, 3);
                        bonus += matchAgainstKeywords(text);
                    }
                    for(var h in h2s)
                    {
                        var text = h2s[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 2, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 2, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 2, 3);
                        bonus += matchAgainstKeywords(text);
                    }
                    for(var h in h3s)
                    {
                        var text = h3s[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 1, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 1, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 1, 3);
                        bonus += matchAgainstKeywords(text);
                    }
                    for(var h in bolds)
                    {
                        var text = bolds[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 1, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 1, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 1, 3);
                        bonus += matchAgainstKeywords(text);
                    }
                    for(var h in italics)
                    {
                        var text = italics[h].replace(/<\S[^><]*>/g, '').replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
                        var words = text.split(' ');
                        var wordsLength = words.length;
                        dictionary1 = appendDictionary(dictionary1, words, 1, 0);
                        dictionary2 = appendDictionary(dictionary2, words, 1, 2);
                        dictionary3 = appendDictionary(dictionary3, words, 1, 3);
                        bonus += matchAgainstKeywords(text);
                    }
                    if(h1s != null) { h1Count += h1s.length; }
                    if(h2s != null) { h2Count += h2s.length; }
                    if(h3s != null) { h3Count += h3s.length; }
                    if(bolds != null) { strongCount += bolds.length; }
                    if(italics != null) { italicCount += italics.length; }
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
    if(count > 500 || count < 100) {
        document.getElementById('total-words').className = 'first warning';
    } else {
        document.getElementById('total-words').className = 'first';
    }

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
            html1 += '<li>' + highLightKeywords(dic1[i][0]) + ' <em>(' + dic1[i][1] + ')</em></li>';
            if(in_array(dic1[i][0], seoKeywords))
            {
                keyWordsInDictionary += (5-i);
            }
        }
        if(dic2[i] != undefined) {
            html2 += '<li>' + highLightKeywords(dic2[i][0]) + ' <em>(' + dic2[i][1] + ')</em></li>';
            if(in_array3(dic2[i][0], seoKeywords))
            {
                keyWordsInDictionary += (5-i);

            }
        }
        if(dic3[i] != undefined) {
            html3 += '<li>' + highLightKeywords(dic3[i][0]) + ' <em>(' + dic3[i][1] + ')</em></li>';
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
    // Second, check if the used keywords are at least in the top 5 of each dictionary. This is 45% of the SEO ranking (3 � 15), 15 = 1,2,3,4,5
    // Third, check if the keywords do not ocupy more then 3% of the total content. This is the last 30%. 2% for each keyword. If the keyword occurs more than 3% in the content, it is considered a penalty.

    var percent        = 0;
    var keyWordsLength = seoKeywords.length;
    var keyWordsFound  = 0;
    var eachPercent    = 25 / keyWordsLength;
    var spamPercent    = 0;
    var extraPenalty   = 0;
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
    if(spamPercent <= .02 || spamPercent >= .04) {
        extraPenalty += 5;
        document.getElementById('keywords-saturation').className = 'warning';
    } else {
        document.getElementById('keywords-saturation').className = '';
    }

    var saturationBonus = 30;
    if(spamPercent <= 0.03)
    {
        saturationBonus -= (30 - (spamPercent * 10));
    } else if(spamPercent > 0.03 && spamPercent <= 0.06) {
        saturationBonus -= (((spamPercent * 100) - 3) * 10);
    } else if(spamPercent > 0.06) {
        saturationBonus = -((spamPercent * 100) - 6);
    }

    document.getElementById('keywords-usage').textContent = keyWordsFound + ' / ' + keyWordsLength;
    document.getElementById('keywords-importance').textContent = Math.round(keyWordsInDictionary * 2.22) + '%';

    if(keyWordsFound != keyWordsLength)
    {
        document.getElementById('keywords-usage').className = 'warning';
        extraPenalty += 5;
    } else {
        document.getElementById('keywords-usage').className = '';
    }

    var endTime = new Date();
    var diff    = endTime.getTime() - startTime.getTime();
    document.getElementById('execution-time').textContent = diff + ' ms';
    document.getElementById('h2-count').textContent = h2Count;
    document.getElementById('h3-count').textContent = h3Count;
    document.getElementById('bold-count').textContent = strongCount;
    document.getElementById('italic-count').textContent = italicCount;

    if(seoIgnoreH1 == false)
    {
        document.getElementById('h1-count').textContent = h1Count;
        if(h1Count != 1) {
            document.getElementById('h1-count').className = 'warning';
            extraPenalty += 5;
        } else {
            document.getElementById('h1-count').className = '';
        }
    }

    if(h2Count == 0 && count > 150) {
        document.getElementById('h2-count').className = 'warning';
        extraPenalty += 3;
    } else {
        document.getElementById('h2-count').className = '';
    }

    if(h3Count == 0 && count > 500) {
        document.getElementById('h3-count').className = 'warning';
        extraPenalty += 1;
    } else {
        document.getElementById('h3-count').className = '';
    }

    if(strongCount == 0) {
        document.getElementById('bold-count').className = 'warning';
        extraPenalty += 3;
    } else {
        document.getElementById('bold-count').className = '';
    }

    if(italicCount == 0) {
        document.getElementById('italic-count').className = 'warning';
        extraPenalty += 2;
    } else {
        document.getElementById('italic-count').className = '';
    }

    document.getElementById('keyword-bonus').textContent = bonus;
    if(bonus == 0)
    {
        document.getElementById('keyword-bonus').className = 'warning';
        extraPenalty += 3;
    } else {
        document.getElementById('keyword-bonus').className = '';
    }

    percent += keyWordsInDictionary;
    percent += saturationBonus;
    if(percent < 0) { percent = 0; }
    if(percent > 100) { percent = 100; }

    var endPercent = percent - extraPenalty;
    if(endPercent < 0) { endPercent = 0; }

    document.getElementById('seo-strength').textContent = Math.round(endPercent) + '% - (' + Math.round(percent) +
        '% - ' + extraPenalty + '% penalty)';

    document.getElementById('field-value').value = Math.round(endPercent);

    if(endPercent < 50) {
        document.getElementById('seo-strength').className = 'warning';
    } else {
        document.getElementById('seo-strength').className = '';
    }

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
        // Ignore words that are no longer than 2 characters:
        if(key.length > 2)
        {
            if (key != '') {
                if (dictionary[key] == undefined) {
                    dictionary[key] = prio;
                } else {
                    dictionary[key] += prio;
                }
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

function matchAgainstKeywords(needle)
{
    var words = needle.split(' ');
    var bonus = 0;
    for(var i in seoKeywords)
    {
        for(var j in words)
        {
            if(words[j] == seoKeywords[i])
            {
                bonus++;
            }
        }
    }
    return bonus;
}

function highLightKeywords(str)
{
    for(var i in seoKeywords)
    {
        str = str.replace(seoKeywords[i], '<strong>' + seoKeywords[i] + '</strong>');
    }
    return str;
}