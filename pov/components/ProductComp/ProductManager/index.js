import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from "../../../styles/modular/ProductManager/ProductManager.module.css"
import { handleSingleFileSubmit } from '../../../utils/helper';
import ModalComp from '../../General/ModalComp';
import Switch from '@mui/material/Switch';


export default function ProductManager(props){
    const [open,setOpen] = useState(false);
    const [selectedCat,setSelectedCat] = useState(null);
    const [productData,setProductData] = useState({
        "name" : "",
        quantity : "",
        description : "",
        prix_unitaire : "",
        prix_achat : "",
        category : "",
        fournisseur : "",
    })

    const [selectedDep,setSelectedDep] = useState(null);
    const [checked,setChecked] = useState(false);



    // creating a product

    const handleChange = (event) => {
        let target = event.target;
        let temp = {...productData};
        temp[target.name] = target.value;
        setProductData(temp);
    }

    const handleCreate = async () => {
        const imageInput = document.getElementById("AddImage");
        let images = imageInput.files
        let body = {...productData}
        body['record'] = checked
        if (images.length > 0){
            if (selectedDep){
                let resp = await handleSingleFileSubmit(images[0],"image","product/?depot_id="+selectedDep,body);
                if (resp){
                    if (!resp.failed){
                        toast.success("Created product")
                        setProductData({
                            "name" : "",
                            quantity : "",
                            description : "",
                            prix_unitaire : "",
                            prix_achat : "",
                            category : "",
                            fournisseur : "",
                        });
                        setOpen(false);
                        props.getProducts(false).then(() => console.log("updated products"))
                        
                    }else{
                        toast.error("failed creating product")
                    }
                }else{
                    toast.error("failed creating product")
                }
            }else{
                toast.info("select a depot")
            }
        }else{
            toast.info("Select a product image")
        }

    }


    const html = (
        <>
            <button className={styles.ProductHandler} onClick={() => setOpen(true)} >Add Products</button>

            <ModalComp open={open} close={() => setOpen(false)}>
                <div className={props.styles.EditModalContainer}>
                     <>
                        <h1 className={props.styles.EditTitle}>Add Product</h1>
                    <label>Category</label>
                    <select name="category" onChange={handleChange}>
                        <option disabled={true} selected={true}>Select a Category</option>
                        {props.cats.map((e,i) => {
                            return <option key={i} value={e.id} selected={e.id === productData.category}>{e.name}</option>
                        })}
                    </select>
                    <label>Fournisseur</label>
                    <select name="fournisseur" onChange={handleChange}>
                    <option disabled={true} selected={true}>Select Fournisseur</option>
                        {props.fournisseurs.map((e,i) => {
                            return <option key={i} value={e.id} selected={e.id === productData.fournisseur}>{e.nom + " " + e.prenom}</option>
                        })}
                    </select>
                    <label>Depot</label>
                    <select name="depots" onChange={(event) => setSelectedDep(event.target.value)}>
                    <option disabled={true} selected={true}>Select a Depot</option>
                        {props.depots.map((e,i) => {
                            return <option key={i} value={e.id} selected={e.id === selectedDep}>{e.nom}</option>
                        })}
                    </select>
                    <label>Product Name</label>
                    <input type="text" name="name" defaultValue={productData.name} onChange={handleChange} />
                    <label>Quantity</label>
                    <input type="text" name="quantity" defaultValue={productData.quantity} onChange={handleChange} />
                    <label>Prix Unitaire</label>
                    <input type="text" name="prix_unitaire" defaultValue={productData.prix_unitaire} onChange={handleChange} />
                    <label>Prix Achat</label>
                    <input type="text" name="prix_achat" defaultValue={productData.prix_achat} onChange={handleChange} />
                    <label>Product Image</label>
                    <label className={props.styles.uploadLabel}>
                    <input hidden={true} type="file" name="image" id="AddImage" accept="image/*" />
                    Upload Your Image
                    </label>
                    <label>Product Description</label>
                    <textarea name="description" rows={5} onChange={handleChange}>{productData.description}</textarea>
                    <label>{"Enregistrer l'operation d'achat"}</label>
                    <Switch
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />

                    <button onClick={handleCreate} className={props.styles.editSave}>Create</button>
                    </>
                    
                </div>

            </ModalComp>
        </>
    );


    return html;

}