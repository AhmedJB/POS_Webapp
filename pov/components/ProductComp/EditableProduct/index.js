import {useEffect,useState,useContext} from 'react'
import Image from 'next/image'
// styles
import styles from '../../../styles/modular/Products/Products.module.css'

// framer
import {motion , AnimatePresence} from "framer-motion"
import { trim } from '../../../utils'
import { PosContext } from '../../../contexts/points'
import { patchReq, req, updateWithFile } from '../../../utils/helper'
import { toast } from 'react-toastify'
import ModalComp from '../../General/ModalComp'
import ProductManager from '../ProductManager'



export default function EditableProduct(props){

	const cardStyle = {
		initial : {
			opacity:0
		},
		animate : (i) => (
			{
				opacity: 1,
				transition:{
					duration: 0.5,
					delay : i * 0.1
				}
			}
		),
		exit : (i) => (
			{
				opacity: 0,
				transition:{
					duration: 0.3,
					delay :  ( 0.1 * filtered.length ) - (0.1 * i)
				}
			}
		)
	}
	
	const {selectedPos,setSelectedPos} = useContext(PosContext);


	const [products,setProducts] = useState([]);
	const [filtered,setFiltered] = useState(products);

    // complementary data
    const [fournisseurs,setFournisseurs] = useState([]);
    const [depots,setDepots] = useState([]);
    
    // modal state
    const [open,setOpen] = useState(false);

    // edit logic
    const [editProd,setEditProd] = useState(null);


	useEffect(() => {
		getProducts().then(() => console.log("loaded products"))
        getFournisseurs().then(() => console.log("loaded fournisseurs"))
        getDepots().then(() => console.log("loaded depots"))
	},[selectedPos])

	// get products

	const getProducts = async (notify = true) => {
		let resp = await req("product/")
		if (resp){
            if (notify){
                toast.info("loaded products")
            }
			
			setProducts(resp);
		}else{
			toast.error("products not loaded")
		}
	}

    // getFournisseurs

    const getFournisseurs = async () => {
        let resp = await req("fournisseur?pid="+selectedPos.id);
        if (resp){
            setFournisseurs(resp);
        }else{
            toast.error("Failed Loading Fournisseurs")
        }
    }

    // getDepots 
    
    const getDepots = async () => {
        let resp = await req("admin/depot/")
        if (resp){
            setDepots(resp);
        }else{
            toast.error("failed getting depots");
        }
    }

	useEffect(() => {
		let temp;
		if (props.selectedCat){
			temp = products.filter((e) => e.category == props.selectedCat.id)
		}else{
			temp = products;
		}
		
		setFiltered(temp);
	},[props.selectedCat,products])
	

	const getStatus = (prod) => {
		if (prod.quantity == 0){
			return styles.danger
		}else if( prod.quantity <= 5) {
			return styles.warning;
		}else{
			return styles.success
		}
	}


    // edit logic here

    const selectToEdit = (prod) => {
        console.log(prod);
        setEditProd(prod);
        setOpen(true);

    }


    const handleChange = (event) => {
        let t = event.target;
        let temp = {...editProd};
        temp[t.name] = t.value;
        console.log(temp);
        setEditProd(temp);
    }

    const handleEdit = async () => {
        const imageInput = document.getElementById("EditImage");
        let body = {...editProd};
        delete body['image'];
        delete body['id'];
        let image = null;
        if (imageInput.files.length > 0){
            console.log("has Images");
            image = imageInput.files[0];
        }else{
            console.log("no images")
        }
        if (image){
            let resp = await updateWithFile(image,"image","product/"+editProd.id+"/",body);
            if (resp){
                setOpen(false);
                setEditProd(null);
                toast.success("Product updated")
                getProducts(false).then(() => console.log("updated products"))
            }else{
                toast.error('failed updating');
            }

        }else{
            let resp = await patchReq("product/"+editProd.id+"/",body);
            if (resp){
                setOpen(false);
                setEditProd(null);
                toast.success("Product updated")
                getProducts(false).then(() => console.log("updated products"))
            }else{
                toast.error('failed updating');
            }
        }

    }

	

	const html = <>
	<div className={styles.newProductSection}>
        <div className={styles.ProductSectionHeader}>
        <h1 className="sectionTitle ml-[20px]">Products</h1>
        <ProductManager cats={props.cats} fournisseurs={fournisseurs} depots={depots} styles={styles} getProducts={getProducts} />
        </div>
	
	<div className={styles.newproductContainer}>
		<AnimatePresence>

			{filtered.map((e,i) =>{
				if (true){
					return <motion.article 
					key={i}
					className={styles.card + " shad"}
					variants={cardStyle}
					initial={"initial"}
					animate = {"animate"}
					custom={i}
					exit = {"exit"}
					
				>
					<div className={styles.imageContainer}>
						<Image src={e.image} width={180} height={170} className={styles.image} />
					</div>
	
					<div className={styles.information}>
						<h3 className={styles.productTitle}>
							{e.name.length > 38 ? trim(e.name,38) : e.name}
						</h3>
						<div className={styles.metricContainer}>
							<span className={styles.price}>{e.prix_unitaire}DH</span>
							<span className={styles.dotSeparator}> . </span>
							<span className={styles.quantity + " " + getStatus(e)}>
								Quantity : {e.quantity}
							</span>
	
						</div>
					</div>

                    <button onClick={() => selectToEdit(e)} className={styles.editButton}>Edit</button>
				</motion.article>
				}
			}
			  )}
			

			


		</AnimatePresence>
	</div>
	</div>
    <ModalComp open={open} close={() => setOpen(false)}>
        <div className={styles.EditModalContainer}>
            {editProd && <>
                <h1 className={styles.EditTitle}>Edit Product</h1>
            <label>Category</label>
            <select name="category" onChange={handleChange}>
                {props.cats.map((e,i) => {
                    return <option key={i} value={e.id} selected={e.id === editProd.category}>{e.name}</option>
                })}
            </select>
            <label>Fournisseur</label>
            <select name="fournisseur" onChange={handleChange}>
                {fournisseurs.map((e,i) => {
                    return <option key={i} value={e.id} selected={e.id === editProd.fournisseur}>{e.nom + " " + e.prenom}</option>
                })}
            </select>
            <label>Product Name</label>
            <input type="text" name="name" defaultValue={editProd.name} onChange={handleChange} />
            <label>Quantity</label>
            <input type="text" name="quantity" defaultValue={editProd.quantity} onChange={handleChange} />
            <label>Prix Unitaire</label>
            <input type="text" name="prix_unitaire" defaultValue={editProd.prix_unitaire} onChange={handleChange} />
            <label>Prix Achat</label>
            <input type="text" name="prix_achat" defaultValue={editProd.prix_achat} onChange={handleChange} />
            <label>Product Image</label>
            <label className={styles.uploadLabel}>
            <input hidden={true} type="file" name="image" id="EditImage" accept="image/*" />
            Upload Your Image
            </label>
            <label>Product Description</label>
            <textarea name="description" rows={5} onChange={handleChange}>{editProd.description}</textarea>

            <button onClick={handleEdit} className={styles.editSave}>Edit</button>
            </>}
            
        </div>

    </ModalComp>
	</>

	return html;


}