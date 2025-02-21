db = db.getSiblingDB('smartalentit');
db.createCollection('users');
db.users.insert({
    "_id" : ObjectId("67b16c091e02224b01a8725a"),
    "userId" : "fa8d77db-35f0-4f88-8cd2-16fd437ab697",
    "name" : "Smart Talent Admin",
    "email" : "info@smartalentit.com",
    "password" : "$2b$10$zAHZcQpihW.MOZ7w5vwcY.fftpVlRq5EsdOHKbd54ILSS/qiXqGoa",
    "role" : {
        "id" : "fc7e474b-2fce-4f07-852e-a3a140bd748d",
        "code" : "admin"
    },
    "createdAt" : new Date(),
    "updatedAt" : new Date(),
    "__v" : 0
});