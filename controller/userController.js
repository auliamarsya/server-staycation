const User = require('../models/Users');

module.exports = {
    login: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        res.render("index", { alert, title: "Staycation | Login" });
    },
}