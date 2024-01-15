const ApiPaths = {
    'department': {
        'getAll': "/Department/all/",
        'addDept': "Department/create/",
        'deleteDept': "Department/delete/"
    },
    'event': {
        'getAll': "/Event/all/",
        'create': "/Event/create/"
    },
    'user': {
        'updateUser': "/User/update/",
        'updateName': "/User/update/name/",
        'getAll': "/User/all/",
        'updateDept': "/User/update/dept/",
        'getUserDept': "/User/dept/",
        'getOne': "/User/"
    },
    'notification': {
        'getAll': "/Notification/all/",
        'addNotification': "/Notification/create/",
        'deleteNotification': "/Notification/delete/"
    },
    'rating':{
        'getRatings': "/Rating/",
        'doRating': "/Rating/doRating/",
        'deleteRating': "/Rating/delete/",
        'createRating': "/Rating/create/"
    }
}

export { ApiPaths};