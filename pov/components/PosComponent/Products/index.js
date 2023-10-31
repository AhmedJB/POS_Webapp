import {useEffect,useState,useContext} from 'react'
import Image from 'next/image'
// styles
import styles from '../../../styles/modular/Products/Products.module.css'

// framer
import {motion , AnimatePresence} from "framer-motion"
import { trim } from '../../../utils'
import { style } from '@mui/system'
import { CartContext } from '../../../contexts/cart'
import { PosContext } from '../../../contexts/points'
import { req } from '../../../utils/helper'
import { toast } from 'react-toastify'



export default function Products(props){

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
	const {cartProducts,setCartProducts} = useContext(CartContext);
	const {selectedPos,setSelectedPos} = useContext(PosContext);


	const [products,setProducts] = useState([]);
	const [filtered,setFiltered] = useState(products);

	/* useEffect(() => {
		if (filtered.length == 0){
			setTimeout(() => setFiltered(products), 500);
		}
		
	},[filtered]) */

	useEffect(() => {
		getProducts().then(() => console.log("loaded products"))
	},[selectedPos,props.refresh])

	// get products

	const getProducts = async () => {
		let resp = await req("product/")
		if (resp){
			toast.info("loaded products")
			setProducts(resp);
		}else{
			toast.error("products not loaded")
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

	const addToCart = (i) => {
		let prod = products[i];
		if (prod.quantity > 0){
			let temp = [...cartProducts]
			let filtered = temp.filter((e) => e.id == prod.id)
			if (filtered.length > 0){
				if (filtered[0].quantity_com + 1 <= filtered[0].quantity){
					filtered[0].quantity_com += 1;
				}
				setCartProducts(temp);
				
			}else{
				let temp =  {...prod};
				temp['quantity_com'] = 1;
				temp['reduction'] = 0;
				let temp2 = [...cartProducts];
				temp2.push(temp);
				setCartProducts(temp2);
			}
		}
		

	}

	const html = <>
	<div className={styles.productSection}>
	<h1 className="sectionTitle">Products</h1>
	<div className={styles.productContainer}>
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
					onClick={() => addToCart(i)}
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
				</motion.article>
				}
			}
			  )}
			

			


		</AnimatePresence>
	</div>
	</div>

	</>

	return html;


}