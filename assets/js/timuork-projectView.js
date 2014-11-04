function Chat() {
    var self = this;
    var timestamp = "";
    var loadedUsers = {};

    var ownMessageTemplate = '<p href="#modalNotification" data-toggle="modal" class="chat-paragraph own"><span class="chat-username"><b>{{messageUserName}}</b></span></br><span class="chat-text">{{messageText}}</span></p>';
    var messageTemplate = '<p href="#modalNotification" data-toggle="modal" class="chat-paragraph"><span class="chat-username"><b>{{messageUserName}}</b></span></br><span class="chat-text">{{messageText}}</span></p>';
    var adminUserTemplate = '<p class="admin-online-users-row"><span class="admin-username">{{userName}}</span><span class="admin-label">ADMIN</span></p>';
    var userTemplate = '<p class="online-users-row">{{userName}}</p>';
    var linkTemplate = '<p class="link-row"><a href="{{linkUrl}}">{{linkCaption}}</a></p>';

    var updateProjectMessagesCallback = function(data) {
        userId = $("[data-user-id]").data("user-id");
        if(data.messages && data.messages.length) {
            $.each(data.messages, function(index, message) {
                if(message.user_id == userId) {
                    var a = Mustache.render(ownMessageTemplate, {messageUserName : message.user_name,
                        messageText : message.message_text});
                }
                else {
                    var a = Mustache.render(messageTemplate, {messageUserName : message.user_name,
                        messageText : message.message_text}); 
                }
                $("#chat").append(a); 
            });
            $("#chat-wrap").scrollTop($("#chat-wrap").height());
            timestamp = data.messages[data.messages.length - 1].message_timestamp;
            console.log(timestamp);
        }
        setTimeout(self.update, 5000);
    };

    var updateOnlineUsersCallback = function(data) {
        if(data.onlineUsers && data.onlineUsers.length) {
            $("#onlineUsers").empty();
            $.each(data.onlineUsers, function(index, user) { 
                if(user.admin) {
                    var p = Mustache.render(adminUserTemplate, {userName : user.name});
                }
                else {
                    var p = Mustache.render(userTemplate, {userName : user.name});
                }
                $("#onlineUsers").append(p);
            });
        }
        setTimeout(self.getUsers, 5000);
    };

    var updateLinksCallback = function(data) {
        if(data.links && data.links.length) {
            $("#links").empty();
            $.each(data.links, function(index, link) {
                var a = Mustache.render(linkTemplate, {linkUrl : link.url, linkCaption : link.caption});
                $("#links").append(a);
            });
        }
        setTimeout(self.getLinks, 5000);
    }

    var createNotificationCallback = function(data){
        $("#modalNotification").modal("hide");
    };
 
    var sendMessageCallback = function(){
        $("#message").val("");
        $("#message").focus();
    };

    var createLinkCallback = function(data) {
        if(data.errors) {
            $.each(data.errors, function(index, error) {
                var div = $("input[name=" + index + "]").parent().parent();
                if (error) {
                    div.popover({ placement: "right", title: "Erro", content: error });
                    div.removeclass("success").addClass("error");
                }
                else {
                    div.removeClass("error").addClass("success");
                }
            });
        }
        else {
            console.log("Sem erros");
            $("#modalLink").modal("hide");
            $(".success, .error").popover("hide");
            $("#caption").val("");
            $("#url").val("");
        }
    };

    var errorCallback = function(xhr, status, error) {
        console.log("Erro");
        console.log(arguments);
    };

    self.update = function() {
        var updateProjectMessagesUrl = $("[data-update-project-messages-url]").data("update-project-messages-url") + 
            $("[data-project-id]").data("project-id");
        $.getJSON(updateProjectMessagesUrl, {timestamp: timestamp}).success(updateProjectMessagesCallback)
            .error(errorCallback);
    };


    /*<option id=-1>Todos</option>
    <?php foreach ($projectUsers as $projectUser) { ?>
    <option id=<?php echo $projectUser->id ?>>
        <?php echo $projectUser->name ?>
    </option>
    <?php } ?>*/

    self.addUser = function() {
        var user = $("#for").val();
        if(loadedUsers[user]) {
            var userOption = $("<option />").attr("data-select-user-id", loadedUsers[user]).text(user);
            $("#users").append(userOption);
            $("#forDiv").hidePopover();
            $("#forDiv").removeClass("error");
            $("#for").val("");
        }
        else {
            $("#forDiv").showPopover({ placement: "right", title: "Erro", 
                content: "Usuário inexistente."}); 
            $("#forDiv").addClass("error");
        }
        $("#for").focus();
    }

    self.removeUser = function() {
        $('#users :selected').each(function(i, selected) {
            $(selected).remove();
        });
    }

    self.sendMessage = function() {
        var sendMessageUrl = $("[data-send-message-url]").data("send-message-url"); 
        var projectId = $("[data-project-id]").data("project-id"); 
        var userId = $("[data-user-id]").data("user-id"); 
        var data = {
            text: $("#message").val(),
            projectId: projectId,
            userId: userId
        };
        $.post(sendMessageUrl, data).success(sendMessageCallback)
            .error(errorCallback);
    }

    self.getUsers = function() {
        var updateOnlineUsersUrl = $("[data-update-online-users-url]").data("update-online-users-url") + 
            $("[data-project-id]").data("project-id");
        $.getJSON(updateOnlineUsersUrl).success(updateOnlineUsersCallback)
            .error(errorCallback);
    }

    self.getLinks = function()  {
        var updateLinksUrl = $("[data-update-links-url]").data("update-links-url") + 
            $("[data-project-id]").data("project-id");
        $.getJSON(updateLinksUrl).success(updateLinksCallback)
            .error(errorCallback);
    }

    self.createNotification = function() {
        var users = []; 
        var createNotificationUrl = $("[data-create-notification-url]").data("create-notification-url");
        var projectId = $("[data-project-id]").data("project-id"); 
        $("[data-select-user-id]").each(function() {
            users.push($(this).data("select-user-id")); 
        });
        var data = {
            projectId: projectId,
            users: users.toString(),
            title: $("#title").val(),
            description: $("#description").val()
        };
        $.post(createNotificationUrl, data).success(createNotificationCallback)
            .error(errorCallback);
    } 

    self.createLink = function() { 
        var createLinkUrl = $("[data-create-link-url]").data("create-link-url");
        var projectId = $("[data-project-id]").data("project-id"); 
        var data = {
            projectId: projectId,
            caption: $("#caption").val(),
            url: $("#url").val()
        };
        $.post(createLinkUrl, data, createLinkCallback, "json")
            .error(errorCallback);
    } 

    self.update();
    self.getUsers();
    self.getLinks();

    $("#newMessage").submit (function(e) {
        self.sendMessage();
        $("#message").val("");
        e.preventDefault();
    });
    
    $("#newNotification").submit(function(e) {
        console.log("Notificação");
        self.createNotification();
        e.preventDefault();
    }); 

    $("#newLink").submit(function(e) {
        console.log("Link");
        self.createLink();
        e.preventDefault();
    });

    $("#addUser").click(function(e) {
        self.addUser(); 
    });

    $("#removeUser").click(function(e) {
        self.removeUser(); 
    });

    $("#for").typeahead({
        source: function(query, callback) {
            var projectId = $("[data-project-id]").data("project-id"); 
            var userId = $("[data-user-id]").data("user-id");
            var refreshProjectUsersUrl = $("[data-search-url]").data("search-url");
            var excludeList = [];
            $("[data-select-user-id]").each(function() {
                excludeList.push($(this).data("select-user-id")); 
            });
            excludeList.push(userId);
            console.log(projectId + "|" + userId + "|" + refreshProjectUsersUrl +
                "|" + excludeList);
            $.get(refreshProjectUsersUrl, { searchString: query, excludeList: excludeList, projectId : projectId }, function(response) {
                var users = [];
                if (response.users && response.users.length) {
                    $.each(response.users, function(index, user) {
                        loadedUsers[user.name] = user.id;
                        users.push(user.name);
                    });
                }    
                callback(users);
            }).error(errorCallback);
        }
    });

}
