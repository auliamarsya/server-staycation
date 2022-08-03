const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const User = require('../models/Users');
const Booking = require('../models/Booking');
const Member = require('../models/Member');

const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewSignin: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        if (req.session.user == null || req.session.user == undefined) {
            res.render("index", { alert, title: "Staycation | Login"});
        } else {
            res.redirect("/admin/dashboard")
        }
    },

    actionSignin: async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username: username});

            if(!user){
                req.flash('alertMessage', 'Cannot found user');
                req.flash('statusAlert', 'danger');
    
                res.redirect('/admin/signin');
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if(!isPasswordMatch){
                req.flash('alertMessage', 'Wrong password');
                req.flash('statusAlert', 'danger');
    
                res.redirect('/admin/signin');
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.redirect('/admin/dashboard');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('/admin/signin');
        }
    },

    actionSignout: (req, res) => {
        req.session.destroy();
        res.redirect("/admin/sigin");
    },

    viewDashboard: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find();

            res.render("admin/dashboard/view_dashboard", { 
                alert, 
                title: "Staycation | Dashboard", 
                user: req.session.user,
                member,
                booking,
                item
            });
        } catch (error) {
            res.redirect('/admin/dashboard');
        }
    },

    // Category
    viewCategory: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const category = await Category.find();

            res.render("admin/category/view_category", { category, alert, title: "Staycation | Category", user: req.session.user  });
        } catch (error) {
            res.render("admin/category/view_category", { alert, title: "Staycation | Category", user: req.session.user});
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({ name });

            req.flash('alertMessage', 'Success Add Category');
            req.flash('statusAlert', 'success');

            res.redirect('category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect('category');
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { id, name } = req.body;

            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save();

            req.flash('alertMessage', 'Success Update Category');
            req.flash('statusAlert', 'success');

            res.redirect('category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('category');
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
            await category.remove();

            req.flash('alertMessage', 'Success Delete Category');
            req.flash('statusAlert', 'success');

            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('category');
        }
    },


    viewBank: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const bank = await Bank.find();

            res.render("admin/bank/view_bank", { bank, alert, title: "Staycation | Bank", user: req.session.user });
        } catch (error) {
            res.render("admin/bank/view_bank", { alert, title: "Staycation | Bank", user: req.session.user });
        }
    },
    addBank: async (req, res) => {
        try {
            const { nameBank, nomorRekening, name } = req.body;

            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });

            req.flash('alertMessage', 'Success Add Bank');
            req.flash('statusAlert', 'success');

            res.redirect('bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect('bank');
        }
    },
    updateBank: async (req, res) => {
        try {
            const { id, nameBank, nomorRekening, name } = req.body;
            const bank = await Bank.findOne({ _id: id });

            if (req.file === undefined) {
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.name = name;
                await bank.save();
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.name = name;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
            }


            req.flash('alertMessage', 'Success Update Bank');
            req.flash('statusAlert', 'success');

            res.redirect('bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`))
            await bank.remove();

            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('statusAlert', 'success');

            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('/admin/bank');
        }
    },


    viewItem: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const item = await Item.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });
            ;

            const category = await Category.find();

            res.render("admin/item/view_item", { item, category, alert, title: "Staycation | Item", action: 'view', user: req.session.user });
        } catch (error) {
            res.render("admin/item/view_item", { alert, title: "Staycation | Item" , user: req.session.user});
        }

    },
    addItem: async (req, res) => {
        try {
            const { title, price, city, categoryId, about } = req.body;

            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: categoryId });
                const newItem = {
                    categoryId,
                    title,
                    description: about,
                    price,
                    city
                }

                const item = await Item.create(newItem);
                category.itemId.push({ _id: item._id });
                await category.save();

                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });

                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }
            }

            req.flash('alertMessage', 'Success Add Item');
            req.flash('statusAlert', 'success');

            res.redirect('item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect('item');

        }
    },
    showImageItem: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const { id } = req.params;

            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                ;

            res.render("admin/item/view_item", { item, alert, title: "Staycation | Show Image Item", action: 'show image', user: req.session.user });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect('item');
        }
    },
    showEditItem: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        try {
            const { id } = req.params;

            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                ;

            const category = await Category.find();

            res.render("admin/item/view_item", { item, alert, category, title: "Staycation | Edit Item", action: 'edit', user: req.session.user});

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect('item');
        }
    },
    updateItem: async (req, res) => {
        try {
            const { id, title, price, city, categoryId, about } = req.body;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });

            if (req.file === undefined) {
                item.title = title;
                item.price = price;
                item.city = city;
                item.categoryId = categoryId;
                item.description = about;

                await item.save();
            } else {
                for (let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = about;
                item.categoryId = categoryId;
                await item.save();
            }

            req.flash('alertMessage', 'Success Update Item');
            req.flash('statusAlert', 'success');

            res.redirect('item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('/admin/item');
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id }).populate('imageId');

            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.remove();
                }).catch((error) => {
                    req.flash('alertMessage', `${error.message}`);
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                });
            }

            await item.remove();

            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('statusAlert', 'success');

            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect('/admin/item');
        }
    },

    viewDetailItem: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        const { itemId } = req.params;
        try {
            const feature = await Feature.find({ itemId: itemId });
            const activity = await Activity.find({ itemId: itemId });

            res.render("admin/item/detail_item/view_detail_item", { itemId, feature, activity, alert, title: "Staycation | Detail Item", user: req.session.user});
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect(`/admin/item/show-detail-item/${itemId}`, { alert, title: "Staycation | Detail Item", user: req.session.user });
        }
    },

    addFeature: async (req, res) => {
        const { name, qty, itemId } = req.body;

        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('statusAlert', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({ _id: itemId });
            item.featureId.push({ _id: feature._id });
            await item.save()

            req.flash('alertMessage', 'Success Add Feature');
            req.flash('statusAlert', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    updateFeature: async (req, res) => {
        const { id, itemId, name, qty } = req.body;
        try {
            const feature = await Feature.findOne({ _id: id });

            if (req.file === undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save();
            } else {
                await fs.unlink(path.join(`public/${feature.imageUrl}`))
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();
            }

            req.flash('alertMessage', 'Success Update Feature');
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        const { id, itemId } = req.params;
        try {
            const feature = await Feature.findOne({ _id: id });

            const item = await Item.findOne({ _id: itemId }).populate('featureId');
            for (let i = 0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() === feature._id.toString()) {
                    item.featureId.pull({ _id: feature._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`));
            await feature.remove();
            req.flash('alertMessage', 'Success Delete Feature');
            req.flash('statusAlert', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },

    addActivity: async (req, res) => {
        const { name, type, itemId } = req.body;

        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image not found');
                req.flash('statusAlert', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({ _id: itemId });
            item.activityId.push({ _id: activity._id });
            await item.save()

            req.flash('alertMessage', 'Success Add Activity');
            req.flash('statusAlert', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    updateActivity: async (req, res) => {
        const { id, itemId, name, type } = req.body;
        try {
            const activity = await Activity.findOne({ _id: id });

            if (req.file === undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();
            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`))
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`;
                await activity.save();
            }

            req.flash('alertMessage', 'Success Update Activity');
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        const { id, itemId } = req.params;
        try {
            const activity = await Activity.findOne({ _id: id });

            const item = await Item.findOne({ _id: itemId }).populate('activityId');
            for (let i = 0; i < item.activityId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({ _id: activity._id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('statusAlert', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },


    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
                            .populate('itemId')
                            .populate('bankId')
                            .populate('memberId');

            res.render("admin/booking/view_booking", { title: "Staycation | Booking", user: req.session.user, booking});
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'danger');

            res.redirect("/admin/booking", { title: "Staycation | Booking", user: req.session.user });
        }
    },

    showDetailBooking: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const statusAlert = req.flash('statusAlert');
        const alert = { message: alertMessage, status: statusAlert };

        const { id } = req.params;

        try {
            const booking = await Booking.findOne({_id: id})
                            .populate('itemId')
                            .populate('bankId')
                            .populate('memberId');

            res.render("admin/booking/show_detail_booking", { title: "Staycation | Detail Booking", user: req.session.user, booking, alert });
        } catch (error) {
            
        }
    },

    actionConfirmation: async (req, res) => {
        const { id } = req.params;

        try {
            const booking = await Booking.findOne({_id: id});

            booking.payments.status = "Accept";
            await booking.save();

            req.flash('alertMessage', 'Success Confirmation Booking');
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/booking/${id}`);
        }
    },

    actionRejection: async (req, res) => {
        const { id } = req.params;

        try {
            const booking = await Booking.findOne({_id: id});

            booking.payments.status = "Reject";
            await booking.save();

            req.flash('alertMessage', 'Success Reject Booking');
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('statusAlert', 'success');

            res.redirect(`/admin/booking/${id}`);
        }
    }
}