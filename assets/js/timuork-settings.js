var editSettingsCallback = function(data) {
    if(data.errors) {
        $.each(data.errors, function(index, error) {
            var div = $("input[name=" + index + "]").parent().parent();
            if (error) {
                div.showPopover({ placement: "right", title: "Erro", content: error }); 
                div.removeClass("success").addClass("error"); }
            else {
                div.hidePopover();
                div.removeClass("error").addClass("success");
            }
        });
    }
    else {
        location.reload();
    }
}

var errorCallback = function(xhr, status, error) {
    console.log(arguments);
}

self.editSettings = function() {
    var editSettingsUrl = $("[data-edit-settings-url]").data("edit-settings-url");
    var username = $("[data-user-username]").data("user-username"); 
    var userId = $("[data-user-id]").data("user-id");
    var accountId = $("[data-user-account-id]").data("user-account-id");
    var data = {
        username: username,
        id: userId,
        name: $("#name").val(),
        email: $("#email").val(),
        accountType: $('#accountType option[selected="selected"]').val(),
        accountValue: $("#accountValue").val(),
        accountId: accountId,
        newPassword: $("#newPassword").val(),
        oldPassword: $("#oldPassword").val()
    }
    $.post(editSettingsUrl, data, editSettingsCallback, "json")
        .error(errorCallback);
}

$("#settings").submit(function(e) {
    e.preventDefault(); 
    self.editSettings();
});

$("#modalSettings").on("show", function() {
    console.log($("[data-user-name]").data("user-name"));
    $(".success, .error").hidePopover();
    $(".modal-body .control-group").removeClass("error").removeClass("success");
    $("#name").val($("[data-user-name]").data("user-name"));
    $("#email").val($("[data-user-email]").data("user-email"));
    $("#accountValue").val($("[data-user-account-value]").data("user-account-value"));
    $("#newPassword").val("");
    $("#oldPassword").val("");
});
