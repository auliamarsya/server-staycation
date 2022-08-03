const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', 'Session is timeout. Please login!');
        req.flash('statusAlert', 'danger');

        res.redirect('/admin/signin')
    } else {
        next();
    }
}

module.exports = isLogin;