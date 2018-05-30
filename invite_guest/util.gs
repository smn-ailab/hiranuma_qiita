function invite(guest_id,channel_id){
  var URL = "https://slack.com/api/channels.invite";
  var token = PropertiesService.getScriptProperties().getProperty("SLACK_OAUTH_TOKEN");

  var queryString = "?token="+token+"&channel="+channel_id+"&user="+guest_id;
  var options = {
   'method' : 'post',
   'contentType': 'application/x-www-form-urlencoded',
  };

  var response = UrlFetchApp.fetch(URL+queryString, options);
  var responseJson = JSON.parse(response.getContentText());
}

function notify(invited_ch_name,user_info,guest_info){

  var URL = "https://slack.com/api/chat.postMessage"
  var token = PropertiesService.getScriptProperties().getProperty("SLACK_OAUTH_TOKEN")

  var text = "@"+user_info.display_name +" used /invite_guest command to invite " + "@"+guest_info.display_name + " to #"+invited_ch_name
  var icon_emoji = ":slack:"
  var notified_ch_name = ""//通知先チャンネル名
  var username = "Slack監視ツール"

  queryString = "?token="+token+"&channel="+notified_ch_name+"&text="+text+"+&icon_emoji="+icon_emoji+"&username="+username+"&link_names=true";
  var options = {
   'method' : 'post',
   'contentType': 'application/x-www-form-urlencoded',
  };
  var response = UrlFetchApp.fetch(URL+queryString, options);

}


function get_user_info(user_id){
  var URL = "https://slack.com/api/users.info";
  var token = PropertiesService.getScriptProperties().getProperty("SLACK_OAUTH_TOKEN");

  var queryString = "?token="+token+"&user="+user_id;
  var options = {
    'method' : 'get',
    'contentType': 'application/x-www-form-urlencoded',
  };

  var response = UrlFetchApp.fetch(URL+queryString, options);
  var user_info = JSON.parse(response.getContentText());

  if(user_info.ok){
    if(user_info.user.is_ultra_restricted){
      return {"display_name":user_info.user.profile.display_name,"permission":"SingleChGuest"};
    }
    else if(user_info.user.is_restricted){
      return {"display_name":user_info.user.profile.display_name,"permission":"MultiChGuest"};
    }
    else if(user_info.user.is_bot){
      return {"display_name":user_info.user.profile.display_name,"permission":"Bot"};
    }
    else{
      return {"display_name":user_info.user.profile.display_name,"permission":"Member"};
    };
  }
 else{
   return {};
 };
}
