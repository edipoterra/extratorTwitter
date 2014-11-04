function Dashboard() {
    var loadedUsersNew = {};
    var loadedUsersEdit = {};

    var myProjectLinkTemplate = '<p class="project-link" data-project-id="{{projectId}}"><a class="my-project-link view-project-link" href="/projects/view/{{projectId}}"><i class="icon-share-alt"></i></a><a class="my-project-link overview-project-link" data-get-project-info-url="/projects/getProjectInfo" href="#"><i class="icon-search"></i></a><a href="#" class="my-project-link edit-project-link" data-get-project-info-url="/projects/getProjectInfo"><i class="icon-cog"></i></a>{{caption}}</p>';
    var otherProjectLinkTemplate = '<p class="project-link" data-project-id="{{projectId}}"><a class="other-project-link view-project-link" href="/projects/view/{{projectId}}"><i class="icon-share-alt"></i></a><a class="other-project-link overview-project-link" data-get-project-info-url="/projects/getProjectInfo" href="#"><i class="icon-search"></i></a>{{caption}}</p>';
    var modalLinkTemplate = '<p id="new-project-link"><a data-add-project-url="/projects/add" data-toggle="modal" href="{{modalId}}">{{caption}}</a></p>';
    var otherProjectsPlaceholderTemplate = '<div class="project-placeholder">Não há projetos a serem exibidos.</div>';
    var myProjectsPlaceholderTemplate = '<div class="project-placeholder">Não há projetos a serem exibidos.<p><a data-toggle="modal" href="{{modalId}}">{{caption}}</a></p></div>'
    var notificationsPlaceholderTemplate = '<div class="notification-placeholder">Não há notificações a serem exibidas.</div>';
    var notificationLinkTemplate = '<a class="notificationLink" href="#" data-notification-id="{{notificationId}}" data-notification-title="{{notificationTitle}}" data-notification-description="{{notificationDescription}}" data-notification-timestamp="{{notificationTimestamp}}" data-notification-sender-id="{{notificationSenderId}}" data-notification-sender-name="{{notificationSenderName}}" data-notification-project-id="{{notificationProjectId}}" data-notification-project-title="{{notificationProjectTitle}}" data-notification-date="{{notificationDate}}">"{{notificationTitle}}"</a> - Enviado há {{timeSinceNotification}} no projeto <a href="/projects/overview/{{notificationProjectId}}">{{notificationProjectTitle}}</a><br />';
    var notificationProjectLinkTemplate = '<a href="/projects/view/{{projectId}}">{{caption}}</a>';
    var notificationTemplate = '<div class="notification"><a class="notificationLink" href="/projects/view/{{projectId}}"></a><div class="notificationHeader"><div class="notificationTitle">{{notificationTitle}}</div><div class="notificationProjectTitle">(Projeto "{{projectTitle}}")</div><div class="notificationSender">{{notificationSender}}</div><div class="notificationTimestamp">{{timeSinceNotification}}</div></div><div class="notificationBody">{{notificationDescription}}</div></div>';
    var allowedUserTemplate = '<option data-select-user-id="{{userId}}">{{userName}}</option>';
    var projectViewUserTemplate = '<div class="project-view-user">{{userName}}</div>';
    var projectViewAdminUserTemplate = '<div class="project-view-admin-user">{{userName}}<i class="icon-star"></i></div>';


    /* Callbacks */
    var updateNotificationsCallback = function(data) {
        $("#notifications").empty();
        if(data.notifications && data.notifications.length) {
            $.each(data.notifications, function(index, notification) {
                var timestamp = new Date((notification.timestamp)*1000);  
                var date = 
                    timestamp.getDate().toString().replace(/^(\d)$/, "0$1") + '/' + 
                    (timestamp.getMonth() + 1).toString().replace(/^(\d)$/, "0$1") + '/' +
                    timestamp.getFullYear().toString().replace(/^(\d)$/, "0$1") + " " + 
                    timestamp.getHours().toString().replace(/^(\d)$/, "0$1") + ':' + 
                    timestamp.getMinutes().toString().replace(/^(\d)$/, "0$1") + ':' +
                    timestamp.getSeconds().toString().replace(/^(\d)$/, "0$1");
                var secondsSince = data.now - notification.timestamp;
                if (secondsSince < 60) {
                    var time = Math.floor(secondsSince.toString()) + 
                        " segundo" + ((secondsSince > 1) ? "s" : "").toString() + " atrás";
                }
                else {
                    var minutesSince = secondsSince / 60;
                    if (minutesSince < 60) {
                        var time = Math.floor(minutesSince.toString()) + 
                            " minuto" + ((minutesSince > 1) ? "s" : "").toString() + " atrás";
                    }
                    else {
                        var hoursSince = minutesSince / 60;
                        if (hoursSince < 24) {
                            var time = Math.floor(hoursSince.toString()) +
                                " hora" + ((hoursSince > 1) ? "s" : "").toString() + " atrás";
                        }
                        else {
                            var daysSince = hoursSince / 24; 
                            var time = Math.floor(daysSince.toString()) +
                                " dia" + ((daysSince > 1) ? "s" : "").toString() + " atrás";
                        }
                    }
                }

                var a = Mustache.render(notificationTemplate, {
                    notificationTitle : notification.title, 
                    notificationDescription : notification.description, 
                    notificationTimestamp : notification.timestamp, 
                    notificationSender : notification.sender_user_name,
                    projectId : notification.project_id,
                    projectTitle : notification.project_title,
                    notificationDate : date, timeSinceNotification: time });
                $("#notifications").append(a);
            });
        }
        else {
            var placeholder = Mustache.render(notificationsPlaceholderTemplate, {});
            $("#notifications").append(placeholder);
        }
        setTimeout(self.getNotifications, 5000);
    }

    var updateOtherProjectsCallback = function(data) {
        $("#otherProjects").empty();
        if(data.otherProjects && data.otherProjects.length) {
            $.each(data.otherProjects, function(index, project) {
                var a = Mustache.render(otherProjectLinkTemplate, {projectId: project.id, caption: project.title});
                $("#otherProjects").append(a);
            });
        }
        else {
            var placeholder = Mustache.render(otherProjectsPlaceholderTemplate, {});
            $("#otherProjects").append(placeholder);
        }
    }

    var updateMyProjectsCallback = function(data) {
        $("#myProjects").empty();
        if(data.myProjects && data.myProjects.length) {
            $.each(data.myProjects, function(index, project) {
                var a = Mustache.render(myProjectLinkTemplate, {projectId: project.id, caption: project.title});
                $("#myProjects").append(a);
            });
            var newProject = Mustache.render(modalLinkTemplate, {modalId: "#modalProject", caption: "Novo Projeto"});
            $("#myProjects").append(newProject);
        }
        else {
            var placeholder = Mustache.render(myProjectsPlaceholderTemplate, {modalId: "#modalProject", caption: "Crie um novo."});
            $("#myProjects").append(placeholder);
        }
    }

    var addProjectCallback = function(data) {
        if(data.errors) {
            $.each(data.errors, function(index, error) {
                var div = $("input[name=" + index + "]").parent().parent();
                if (error) {
                    div.showPopover({ placement: "right", title: "Erro", content: error });
                    div.removeClass("success").addClass("error");
                }
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

    var showEditProjectModalCallback = function(data) {
        if(data.project) {
            $("#usersEdit").empty(); 
            $("#titleEdit").val(data.project.title);
            var adminUserId = data.project.admin_user_id;
            $("#descriptionEdit").val(data.project.description);
            $("#newUserEdit").val("");
            if(data.allowedUsers) {
                $.each(data.allowedUsers, function(i, user) {
                    if(user.id != adminUserId) {
                        var option = Mustache.render(allowedUserTemplate, { userId : user.id, userName : user.name });
                        $("#usersEdit").append(option);
                    }
                });
            }
            $(".modal-body .control-group").removeClass("error").removeClass("success");
            $(".control-group").hidePopover();
            $("#modalEdit").modal("show");    
        }
    }

    var showViewProjectModalCallback = function(data) {
        if(data.project) {
            $("#usersView").empty();
            $("#modalViewHeader").text(data.project.title);
            var adminUserId = data.project.admin_user_id;
            $("#descriptionView").text(data.project.description);
            $("#titleView").text(data.project.title);
            if(data.allowedUsers) {
                $.each(data.allowedUsers, function(i, user) {
                    if(user.id != adminUserId) {
                        var user = Mustache.render(projectViewUserTemplate, { userName : user.name });
                        $("#usersView").append(user);
                    }
                    else {
                        var user = Mustache.render(projectViewAdminUserTemplate, { userName : user.name });
                        $("#usersView").append(user);
                    }
                });
            }
            $("#modalView").modal("show");
        }
    }

    var editProjectCallback = function(data){
        if(data.errors) {
            $.each(data.errors, function(index, error) {
                var div = $("input[name=" + index + "]").parent().parent();
                if (error) {
                    div.showPopover({ placement: "left", title: "Erro", content: error });
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
    };

    var errorCallback = function(xhr, status, error) {
        console.log(arguments);
        console.log(xhr);
    }

    /* Modal-related */
    self.addUserNew = function() {
        var user = $("#newUserNew").val();
        if(loadedUsersNew[user]) {
            var userOption = $("<option />").attr("data-select-user-id", loadedUsersNew[user]).text(user);
            $("#usersNew").append(userOption);
            $("#newUserDiv").hidePopover();
            $("#newUserDiv").removeClass("error");
            $("#newUserNew").val("");
        }
        else {
            $("#newUserDiv").showPopover({ placement: "right", title: "Erro", 
                content: "Usuário inexistente."}); 
            $("#newUserDiv").addClass("error");
        }
        $("#newUserNew").focus();
    }

    self.removeUserNew = function() {
        $('#usersNew :selected').each(function(i, selected) {
            $(selected).remove();
        });
    }
    
    self.addUserEdit = function() {
        var user = $("#newUserEdit").val();
        if(loadedUsersEdit[user]) {
            var userOption = $("<option />").attr("data-select-user-id", loadedUsersEdit[user]).text(user);
            $("#usersEdit").append(userOption);
            $("#newUserEditDiv").hidePopover();
            $("#newUserEditDiv").removeClass("error");
            $("#newUserEdit").val("");
        }
        else {
            $("#newUserEditDiv").showPopover({ placement: "right", title: "Erro", 
                content: "Usuário inexistente."}); 
            $("#newUserEditDiv").addClass("error");
        }
        $("#newUserEdit").focus();
    }

    self.removeUserEdit = function() {
        $('#usersEdit :selected').each(function(i, selected) {
            $(selected).remove();
        });
    }

    $("#newUserNew").typeahead({
        source: function(query, callback) {
            var adminUserId = $("[data-user-id]").data("user-id");
            var refreshUsersUrl = $("[data-search-url]").data("search-url");
            var excludeList = [];
            $("#usersNew > [data-select-user-id]").each(function() {
                excludeList.push($(this).data("select-user-id")); 
            });
            excludeList.push(adminUserId);
            $.get(refreshUsersUrl, { searchString: query, excludeList: excludeList }, function(response) {
                var users = [];
                if (response.users && response.users.length) {
                    $.each(response.users, function(index, user) {
                        loadedUsersNew[user.name] = user.id;
                        users.push(user.name);
                    });
                }    
                callback(users);
            });
        }
    });

    $("#newUserEdit").typeahead({
        source: function(query, callback) {
            var projectId = $("[data-project-id]").data("project-id");
            var adminUserId = $("[data-user-id]").data("user-id");
            var refreshUsersUrl = $("[data-search-url]").data("search-url");
            var excludeList = [];
            $("#usersEdit > [data-select-user-id]").each(function() {
                excludeList.push($(this).data("select-user-id")); 
            });
            excludeList.push(adminUserId);
            $.get(refreshUsersUrl, { searchString: query, excludeList: excludeList }, function(response) {
                var users = [];
                if (response.users && response.users.length) {
                    $.each(response.users, function(index, user) {
                        loadedUsersEdit[user.name] = user.id;
                        users.push(user.name);
                    });
                }    
                callback(users);
            });
        }
    });

    /* Data-changing related */
    self.addProject = function() {
        var allowedUsers = [];
        var addProjectUrl = $("[data-add-project-url]").data("add-project-url");
        var userId = $("[data-user-id]").data("user-id");
        $("#usersNew option").each(function() {
            allowedUsers.push($(this).data("select-user-id")); 
        });
        var data = {
            allowedUsers: allowedUsers,
            title: $("#titleNew").val(),
            description: $("#descriptionNew").val(),
            userId: userId 
        };
        $.post(addProjectUrl, data, addProjectCallback)
            .error(errorCallback);
    }

    self.editProject = function() {
        var projectId = $("[data-project-id]").data("project-id");
        var adminUserId = $("[data-user-id]").data("user-id");
        var editProjectUrl = $("[data-edit-project-url]").data("edit-project-url");
        var users = [];
        $("[data-select-user-id]").each(function() {
            users.push($(this).data("select-user-id")); 
        });
        users.push(adminUserId);
        var data = {
            users : users,
            projectId : projectId,
            title : $("#titleEdit").val(),
            description : $("#descriptionEdit").val(),
            adminUserId : adminUserId
        };
        $.post(editProjectUrl, data, editProjectCallback, "json")
            .error(errorCallback);
    }

    /* View related */
    self.getMyProjects = function() {
        updateMyProjectsUrl = $("[data-update-my-projects-url]").data("update-my-projects-url");
        $.getJSON(updateMyProjectsUrl).success(updateMyProjectsCallback)
            .error(errorCallback);
    }
    
    self.getOtherProjects = function() {
        updateOtherProjectsUrl = $("[data-update-other-projects-url]").data("update-other-projects-url");
        $.getJSON(updateOtherProjectsUrl).success(updateOtherProjectsCallback)
            .error(errorCallback);
    }
   
    self.getNotifications = function() {
        updateNotificationsUrl = $("[data-update-notifications-url]").data("update-notifications-url");
        $.getJSON(updateNotificationsUrl).success(updateNotificationsCallback)
            .error(errorCallback);
    }

    self.showEditProjectModal = function(id, url) {
        $.post(url, { projectId : id } , showEditProjectModalCallback, "json")
            .error(errorCallback);
    }

    self.showViewProjectModal = function(id, url) {
        $.post(url, { projectId : id } , showViewProjectModalCallback, "json")
            .error(errorCallback);
    }

    if($("#modalWelcome").length) {
        $("#modalWelcome").modal("show");
        setTimeout(function() {
            $("#modalWelcome").modal("hide")
        }, 3000);
    } 
    if($("#modalWarning").length) {
        $("#modalWarning").modal("show");
        setTimeout(function() {
            $("#modalWarning").modal("hide")
        }, 3000);
    } 
    self.getMyProjects();
    self.getOtherProjects();
    self.getNotifications();
   
    /* Event related */
    $("#newProject").submit(function(e) {
        e.preventDefault();
        self.addProject();
    });

    $("#editProject").submit(function(e) {
        self.editProject();
        e.preventDefault();
    });

    $("#addUserNew").click(function(e) {
        self.addUserNew(); 
    });

    $("#removeUserNew").click(function(e) {
        self.removeUserNew(); 
    });

    $("#addUserEdit").click(function(e) {
        self.addUserEdit(); 
    });

    $("#removeUserEdit").click(function(e) {
        self.removeUserEdit(); 
    });

    $("#myProjects").on("click", ".edit-project-link", function(e) {
        e.preventDefault(); 
        var id = ($(this).parent()).attr("data-project-id");
        var url = ($(this)).attr("data-get-project-info-url");
        self.showEditProjectModal(id, url);
    });

    $("#myProjects, #otherProjects").on("click", ".overview-project-link", function(e) {
        e.preventDefault(); 
        var id = ($(this).parent()).attr("data-project-id");
        var url = ($(this)).attr("data-get-project-info-url");
        self.showViewProjectModal(id, url);
    });

    $("#modalProject").on("hide", function() { 
        $("#titleNew").val("");
        $("#descriptionNew").val("");
        $("#newUserNew").val("");
        $("#usersNew option").each(function(i, selected) {
            $(selected).remove();
        });
        $(".modal-body .control-group").removeClass("error").removeClass("success");
        $(".control-group").hidePopover();
    });

    $("#modalProject").on("show", function() {
        $("#newUserNew").focus();
    });

    $(".div-content").on("click", ".notificationLink", function(e) {
        $("#viewNotificationModalHeaderTitle").text($(this).attr("data-notification-title"));
        var projectId = $(this).attr("data-notification-project-id");
        var a = Mustache.render(notificationProjectLinkTemplate, {projectId: projectId, caption: "Ir para o projeto"});
        $("#notificationTimestamp").text($(this).attr("data-notification-date"));
        $("#notificationTitle").text($(this).attr("data-notification-title"));
        $("#notificationSender").text($(this).attr("data-notification-sender-name"));
        $("#notificationDescription").text($(this).attr("data-notification-description"));
        $("#notificationProjectLink").text("");
        $("#notificationProjectLink").append(a);
        $("#modalViewNotification").modal("show");
    });
}
