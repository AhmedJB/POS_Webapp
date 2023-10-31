import React, { useContext, useEffect, useState } from 'react';
import CategorieStyles from "../../styles/modular/categorie/Categorie.module.css"
import picture1 from "../../assets/images/1.jpg"
import Image from 'next/image';
import CategorieManager from './CategorieManager';
import { req } from '../../utils/helper';
import { PosContext } from '../../contexts/points';
import { UserContext } from '../../contexts/user';
import { toast } from 'react-toastify';
import Categories from '../PosComponent/Categories';
import EditableProduct from './EditableProduct';



export default function ProductComp(props) {

	// contexts 
	const {selectedPos,setSelectedPos} = useContext(PosContext);
	const {user,setUser} = useContext(UserContext);

	const [categories,setCategories] = useState([]);

	const [selectedCat,setSelectedCat] = useState(null);



	const fetchCategories = async (notify=true) => {
		let resp = await req("category/?pid="+selectedPos.id)
		if (resp){
			if (notify){
				toast.info("loaded categories");
			}
			
			setCategories(resp);
		}else{
			if (notify){
				toast.error("failed loading categories");
			}
			
		}
	}

	const refresh = () => {
		fetchCategories(false).then(() => console.log("updated cats"));
	}

	useEffect(() => {
		fetchCategories().then(() => console.log("fetched categories"))
	}, [user,selectedPos])


	const html = (<>
		<div className={CategorieStyles.container}>
			<div className={CategorieStyles.header}>
				<div className={CategorieStyles.first}>
					<h2>Products management</h2>
					<CategorieManager cats={categories} refresh={refresh} selectedPos={selectedPos} />
				</div>
				<Categories cats={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
				
			</div>

			<>
			<div className={CategorieStyles.productsSection}>
				<EditableProduct selectedCat={selectedCat} cats={categories} />
			</div>
			</>
		</div>
	</>

	);

	return html

}