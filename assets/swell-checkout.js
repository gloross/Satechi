// initializing 
(function() {
  $(document).on("swell:setup", function() {
    SwellConfig.Referral.initializeReferral(".swell-referral");

    $(".swell-referral-post-checkout").show();
    $(".swell-referral-post-checkout").css("display", "flex");

    $( 'body' ).on('click',".swell-referral-post-checkout .back-link-holder .swell-referral-back-link", function() {
      $(".swell-referral-post-checkout").hide();
    });

    $( document ).on('click',"#swell-referral-register-submit", function() {
      setTimeout(function(){
        if(spapi.customer.referral_receipts) {
          if(spapi.customer.email) {
            $(".swell-referral-content-main").addClass("refer-step");
          }
        } else {
          setTimeout(function(){
            if(spapi.customer.email) {
              $(".swell-referral-content-main").addClass("refer-step");
            }
          },1000)
        }
      },1000)
    });

    $(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) { 
      if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
        $(".refer-customer-error").remove();
        $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Sorry! Looks like this person has already made a purchase. Try referring another friend.</p>');
        $("#swell-referral-refer-emails").addClass("error-border");
      }

      if(textStatus && textStatus === "Please enter a valid email address"){
          $(".refer-customer-error").remove();
          $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
          $("#swell-referral-refer-emails").addClass("error-border");
        }
    });
  });
}).call(this);

// referral
(function() {
  window.SwellConfig = window.SwellConfig || {};

  SwellConfig.Referral = {
    opts: {
      localization: {
        referralSidebarDetailsAction: "Refer a Friend",
        referralSidebarDetailsReward: "",

        referralRegisterHeading: "<span> Refer a Friend </span> Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralRegisterFormDetails: "Please submit your email below to get started.",
        referralRegisterFormEmail: "your email address",
        referralRegisterFormSubmit: "Next",
        referralRegisterDetails: "Refer your friends and get $10 when they place their first order.",

        referralReferHeading: "<span> Refer a Friend </span> Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralReferFormEmails: "Submit your friend's email here...",
        referralReferFormSubmit: "Send",
        referralReferFormDetails: "Get started by referring your friend via email below or clicking any of the other share options below.",
        referralReferFormEmailsDetails: "",
        referralReferDetails: "Refer your friends and get $10 when they place their first order.",

        referralReferMediaDetails: "Share your referral link with friends",

        referralShareFacebook: "Share",
        referralShareTwitter: "Tweet",
        referralShareCopy: "Copy Link",
        referralShareMessenger: "Message",
        referralShareSMS: "SMS",

        referralFacebookIcon: "swell-icon-rewardsFacebook",
        referralTwitterIcon: "swell-icon-rewardsTwitter",
        referralLinkIcon: "swell-icon-rewardsCopy-link",
        referralMessengerIcon: "swell-icon-rewardsMessage",
        referralSMSIcon: "swell-icon-rewardsSMS",

        referralThanksHeading: "Thanks for Referring!",
        referralThanksDetails: "Remind your friends to check their emails.",

        referralCopyHeading: "",
        referralCopyButton: "Copy Link",
        referralCopyDetails: "Copy and share link with your friends"
      },
      templates: {
        referralRegister: '<div class="swell-referral-register"> <h2 class="swell-referral-heading"><%= localization.referralRegisterHeading %></h2> <p class="swell-referral-details"><%= localization.referralRegisterDetails %></p> <div class="swell-referral-border"></div> <div class="swell-referral-form-wrapper"> <form name="swell-referral-register-form" id="swell-referral-register-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralRegisterFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="email" name="swell-referral-register-email" id="swell-referral-register-email" required="required" placeholder="<%= localization.referralRegisterFormEmail %>"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-register-submit" id="swell-referral-register-submit" value="<%= localization.referralRegisterFormSubmit %>"> </li> </ul> </div> </form> </div> </div>',
        referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><%= localization.referralReferHeading %></h2> <p class="swell-referral-details"><%= localization.referralReferDetails %></p> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralReferFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmails %>"> <span class="swell-referral-form-field-details"><%= localization.referralReferFormEmailsDetails %></span> <div class="swell-referral-form-footer"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>"> </div> </li> </ul> </div> </form> </div> <div class="swell-referral-media-wrapper"> <p class="swell-referral-media-details"><%= localization.referralReferMediaDetails %></p> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareFacebook %> </div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralSMSIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareSMS%> </div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralMessengerIcon %>" aria-hidden="true"> <span class="path1"></span> <span class="path2"></span> </i> &nbsp;<%= localization.referralShareMessenger %></div> </li> <li class="swell-referral-medium swell-share-referral-twitter"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralTwitterIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareTwitter %> </div> </li> <li class="swell-referral-medium swell-share-referral-copy"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareCopy %> </div> </li> </ul> </div> </div>'
      }
    },
    initializeReferral: function(containerSelector) {
      var email = $(containerSelector).data("customer-email");
      if (email) {
        spapi.storage.setItem("referrer_email", email);
        spapi.customer.email = email;
      }
      Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);
    }
  };
}).call(this);
