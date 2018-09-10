
<template>
    <div>
        <input id="searchBox" type="text" placeholder="Search" />
        <i id="siteSearchBtn" class="fa  fa-search"></i>
        <script type="text/javascript">
            <!-- console.log("this",  '{{newsletter_email}}') -->
            var ss360Config = {
                siteId: '{{siteId}}',
                searchBox: {selector: '{{searchBoxSelector}}'},
                suggestions: {
                    showImages: true,
                    throttleTime: 150,
                },
                style: {
                    themeColor: '{{themeColor}}'
                },
                results: {
                    embedConfig: {'url':'{{resultPageURL}}','contentBlock':'{{resultPageContainer}}'},
                    highlightQueryTerms: true
                }
            };
        </script>
        <script src="https://sitesearch360.com/cdn/sitesearch360-v11.min.js" async></script>
    </div>
</template>