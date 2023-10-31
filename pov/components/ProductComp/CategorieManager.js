import React, { useState } from 'react';
import styles from "../../styles/modular/CategorieManager/CategorieManager.module.css"
import ModalComp from '../General/ModalComp';
import DoneIcon from '@mui/icons-material/Done';
import CategorieElement from './CategorieElement';
import { postReq } from '../../utils/helper';
import { toast } from 'react-toastify';


export default function CategorieManager(props){
    const [open,setOpen] = useState(false);
    const [selectedCat,setSelectedCat] = useState(null);

    // creating a category

    const createCat = async () => {
        let name = document.getElementById("catName").value;
        let body = {
            name,
            pov: props.selectedPos.id
        }
        let resp = await postReq("category/",body);
        if (resp){
            toast.success("Created Category");
            props.refresh()
        }else{
            toast.error("failed creating category")
        }
    }

    const html = (
        <>
            <button className={styles.CategoryHandler} onClick={() => setOpen(true)} >Manage Categories</button>

            <ModalComp open={open} close={() => setOpen(false)}>
                <div className={styles.modalContainer}>
                    <h1 className={styles.modalTitle}>
                        Category Manager
                    </h1>
                    <ul className={styles.CategoryList}>
                        {
                            props.cats.map((e,i) => {
                                return <li key={i} className={styles.CategoryElement}>
                                    <CategorieElement refresh={props.refresh} styles={styles} cat={e} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
                                </li>
                            })
                        }
                    </ul>
                    <div className={styles.addHandler}>
                        <input className={styles.addInput} placeholder="Add New Category" type="text" id="catName" />
                        <span onClick={createCat} className={styles.IconContainer}>
                            <DoneIcon className={styles.icon} />
                        </span>
                    </div>
                </div>
            </ModalComp>
        </>
    );


    return html;

}