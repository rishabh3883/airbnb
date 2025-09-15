    const { response } = require("express");
const Listing=require("../models/listing.js");
    const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
     const mapToken = process.env.MAP_TOKEN;
    const geocodingClient = mbxgeocoding({ accessToken: mapToken });

    module.exports.index = async (req, res)=>{
            const allListings = await Listing.find({});
            res.render("listings/index.ejs",{allListings});
    };

    module.exports.renderNewForm =  (req,res) =>{
            res.render("listings/new.ejs");
    };

    module.exports.showListing = async (req,res) =>{
            let {id} = req.params;
            const listing = await Listing
                .findById(id)
                .populate({
                    path:"reviews",
                    populate:{
                      path:"author"
                    },
                })
                .populate("owner");
            if(!listing){
                req.flash("error","Listing you requested for does not exist");
                res.redirect("/listings")
            }
            console.log(listing);
            res.render("listings/show.ejs",{listing});
    };

    module.exports.createListing = async (req, res) =>{
        let response= await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
            })
            .send();
          

        let url=req.file.path;
        let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};

        newListing.geometry = response.body.features[0].geometry;

        let saveListing = await newListing.save();
        console.log(saveListing);
        req.flash("success","new Listing Created");
        res.redirect("/listings");
    };



    module.exports.rendereditListing = async(req,res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload/h_300,w_22");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    };


    module.exports.updateListing = async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(req.file ){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename}
        await listing.save();
        }
        req.flash("success"," Listing Updated")
        res.redirect(`/listings/${id}`);
    };

    module.exports.DeleteListing = async (req,res)=>{
        let {id} = req.params;
        let a= await Listing.findByIdAndDelete(id);
        console.log(a);
        req.flash("success"," Listing Deleted")
        res.redirect("/listings");
    };