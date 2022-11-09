        let cmplz_rolex_enabled = false;
        function cmplz_set_rlx_cookie(value){
            let secure = ";secure";
            let date = new Date();
            let name = 'rlx-consent';
            date.setTime(date.getTime() + (complianz.cookie_expiry * 24 * 60 * 60 * 1000));
            let expires = ";expires=" + date.toGMTString();
            document.cookie = name + "=" + value + ";SameSite=Lax" + secure + expires;
        }

        /**
         * Set a complianz rlx cookie and the custom cookie on save preferences
         */
        document.addEventListener('click', e => {
            if (e.target.closest('.cmplz-save-preferences')) {
                let rlx_enabled = document.querySelector('input.cmplz-rlx').checked;
                if (rlx_enabled) {
                    cmplz_enable_rolex();
                    console.log("allow rlx from click ");
                } else {
                    console.log("revoke rolex on click ");
                    cmplz_revoke_rolex();
                }
            }
        });

        document.addEventListener("cmplz_fire_categories", function (e) {
            var consentedCategories = e.detail.categories;
            if ( cmplz_in_array( 'marketing', consentedCategories ) || cmplz_in_array( 'rlx', consentedCategories ) ) {
                cmplz_set_cookie('rlx', 'allow');
                cmplz_enable_rolex();
            }
        });

        document.addEventListener("cmplz_revoke", function (e) {
            cmplz_revoke_rolex();
        });

        document.addEventListener("cmplz_before_cookiebanner", function(e) {
            if ( cmplz_get_cookie('rlx') === 'allow'){
                cmplz_enable_rolex();
            } else {
                cmplz_revoke_rolex();
            }
        });

        function cmplz_enable_rolex(){
            if ( cmplz_rolex_enabled ) return;

            console.log("enable rolex consent");
            document.querySelector('input.cmplz-rlx').checked = true;
            cmplz_set_cookie('rlx', 'allow');
            cmplz_set_rlx_cookie(true);
            _satellite.setVar("Analyticsconsent","true");
            _satellite.track("PageView");
            let rlxCorner = document.getElementById("rlx-corner");
            if ( rlxCorner ) {
                rlxCorner.contentWindow.postMessage("consentTrue","https://corners.rolex.com");
                rlxCorner.contentWindow.postMessage("consentValidation","https://corners.rolex.com");
            }
            cmplz_rolex_enabled = true;
        }

        function cmplz_revoke_rolex(){
            console.log("revoke rolex consent");
            cmplz_set_cookie('rlx', 'deny');
            _satellite.setVar("Analyticsconsent","false");
            //set a default false value, as workaround for rlx issue which checks for false cookie, instead of also checking for not-existing one.
            cmplz_set_rlx_cookie(false);
            cmplz_rolex_enabled = false;
        }

        /**
         * Handle revoke
         */
        document.addEventListener("cmplz_revoke", function(e) {
            cmplz_revoke_rolex();
        });