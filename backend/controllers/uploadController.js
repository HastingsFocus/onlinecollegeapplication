export const uploadFile = async(req,res)=>{

    try{


        if(!req.file){

            return res.status(400).json({

                message:"No file uploaded"

            });

        }


        res.json({

            message:"File uploaded successfully",

            fileUrl:req.file.path,

            fileName:req.file.originalname,

            fileType:req.file.mimetype

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};