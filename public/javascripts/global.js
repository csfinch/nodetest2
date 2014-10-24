var userListData = [];
$(document).ready(function(){
    populateTable();
    $('#userList table tbody').on('click','td a.linkshowuser',showUserInfo);
    $('#btnAddUser').on('click',addUser);
    $('#userList table tbody').on('click','td a.linkdeleteuser',deleteUser);
});


function populateTable() {
    var tableContent = '';
    $.getJSON('/users/userlist', function (data) {
        userListData = data;
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="'+this.username+'" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="'+this._id+'">delete</a></td>';

            tableContent += '</tr>';
        });

        $('#userList table tbody').html(tableContent);
    });
}

//show user info
function showUserInfo(event){
    event.preventDefault();
    var thisUserName = $(this).attr('rel');
    var arrayPosition = userListData.map(function(item){return item.username}).indexOf(thisUserName);

    //get our user object
    var thisUserObject = userListData[arrayPosition];
    //populate info box
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);


}

function addUser(event){
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index,val){
        if($(this).val() === '') {errorCount++;}
    });

    if(errorCount === 0){
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullName').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val()
        };

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(res){
            if(res.msg === ''){
                $('#addUser fieldset input').val('');

                populateTable();
            } else {
                alert('Error: ' + res.msg);
            }
        });
    } else {
        alert('Please fill in all fields');
        return false;
    }

}

//show user info
function deleteUser(event){
    event.preventDefault();
    var confirmation = confirm('Are you sure?');
    if(confirmation === true){
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(res){
            if(res.msg === ''){

            }else{
                alert('Error:' + err);
            }
            populateTable();

        });
    } else{
        return false;
    }

}
