

function doPost(e) {

  if (e.parameter.token != PropertiesService.getScriptProperties().getProperty("SLACK_VERIFICATION_TOKEN"))
  {
    throw new Error('Invalid token')
  }

  var user_id = e.parameter.user_id
  var guest_id = e.parameter.text.trim().split('|')[0].slice(2)
  var channel_id = e.parameter.channel_id
  var channel_name = e.parameter.channel_name
  var user_info = get_user_info(user_id)
  var guest_info = get_user_info(guest_id)

  var response = { text: "" }

  if (user_info.permission != "Member"){
      response.text = "You cannot invite guest account!"
  }
  else if (Object.keys(guest_info).length == 0) {
     response.text = "guest account is not found!"
  }
  else if (guest_info.permission == "SingleChGuest" || guest_info.permission == "Bot"){
      response.text = Utilities.formatString("You cannot invite becouse target account is %s",guest_info.permission)
  }
  else {
    invite(guest_id,channel_id)
    notify(channel_name,user_info,guest_info)
    response.text = "Success!"
  }
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON)
}
