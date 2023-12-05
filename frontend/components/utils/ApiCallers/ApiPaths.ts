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
    'notification': {
        'addNotification': "/User/update/notifications/",
    },
    'rating': {
        'getOnePath': "/Rating",
        'addRatingPath': "Rating/create/",
        'updateRatingPath': "Rating/update/",
        'deleteRatingPath': "Rating/delete/"
    },
    'user': {
        'updateUser': "/User/update/",
        'updateName': "/User/update/name/",
        'getAll': "/User/all/",
        'updateDept': "/User/update/dept/",
        'getUserDept': "/User/dept/",
        'getOne': "/User/"
    }
}

export { ApiPaths};