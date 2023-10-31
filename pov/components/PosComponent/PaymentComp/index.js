import {useEffect,useState,useContext} from "react";
import { CartContext } from "../../../contexts/cart";
import styles from "../../../styles/modular/PaymentComp/PaymentComp.module.css"
import {motion} from "framer-motion"
import Pavet from "../../General/Pavet";
import DoneIcon from '@mui/icons-material/Done';

import Cash from "../../../assets/payment/Cash.svg"
import Image from "next/image";


// MUI 
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { PosContext } from "../../../contexts/points";
import { req } from "../../../utils/helper";
import { toast } from "react-toastify";


export default function PaymentComp(props){
	const {cartProducts,setCartProducts} = useContext(CartContext);
	const {selectedPos,setSelectedPos} = useContext(PosContext);
	const [selectedClient,setSelectedClient] = props.cl;
	const [paid,setPaid] = props.pd;
	const [clients,setClients] = useState([]);
	const confirmAnimation = {
		initial : {
			opacity:0,
			x: "50%"
		},
		enter : {
			opacity  : 1,
			x : 0,
			transition:{
				duration:.5,
				delay:.5
			}
		},
		exit : {
			opacity : 0,
			x: "50%",
			transition:{
				duration: .5
			}
		}
	}

	const [selectedId,setSelectedId] = useState(null);

	const [selectedClientId,setSelectedClientId] = useState(null)


	const boxStyle = {
		width:"100%",
		maxWidth:"200px",
		bgcolor:"var(--main-dark)",
		borderRadius: 3,
		marginLeft:2,
	}

	const labelStyle = {
		
		"& .Mui-focused" : {
			color:"var(--orange)"
		}
	}

	const selectStyle = {
		borderRadius:3,
		"& .MuiSvgIcon-root":{
			color:"white"
		},
		"& .Mui-focused" : {
			borderColor:"var(--orange)"
		}
	}

	const formStyle = {
		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline" : {
			borderColor:"var(--orange)"
		},
		"& .MuiInputLabel-root" : {
			color:"var(--orange)"
		},
		"& .MuiSelect-select" : {
			color: "white"
		},
		"& .MuiInputLabel-root.Mui-focused" : {
			color:"var(--orange)"
		}
	}
	// loading clients
	useEffect(() => {
		loadClients().then(() => console.log("loaded clients"))
	},[selectedPos])

	const loadClients = async () => {
		let resp = await req("clients?pid="+selectedPos.id);
		if (resp){
			setClients(resp)
		}
		
	}

	// total function

	function calculateTotal(){
		let total = 0;
		total = cartProducts.map((e,i) => {
			console.log(e);
			return (e.prix_unitaire * e.quantity_com) * (1 - (e.reduction / 100))
		})

		total = total.reduce((pv, cv) => pv + cv, 0);
		console.log(total)
		return total
	}

	// on change functions
	function handleChange(e,value){
		console.log(e);
		console.log(value);
		setSelectedClientId(value.props.value);
		setSelectedClient(clients.filter((e) => e.id == value.props.value)[0]);
	}

	function submit(){
		if (!selectedClient){
			toast.warn("Chose a client")
		}else{
			let inp = document.getElementById("paid")
		setPaid(Number(inp.value));
		props.execute();
		}
		

	}

	const html = <>
		<motion.div
		variants={confirmAnimation}
		className={styles.cartContainer}
		initial={"initial"}
		animate = {"enter"}
		exit = {"exit"}
	>
		<div className={styles.cartTitleContainer}>
		<h1 className={'sectionTitle ' + styles.cartTitle}>Payment</h1>
		<hr className={styles.divider} />
		</div>
		<div className={styles.paymentTypeContainer}>
			<div>
			<h1 className={'sectionTitle ' + styles.paymentSubTitle}>Payment Type</h1>
		<div className={styles.cashContainer}>
			<Image src={Cash} width={20} height={20} />
			<span className={styles.cashCaption}>Cash</span>
		</div>

			</div>
		<div>
		<h1 className={'sectionTitle ' + styles.paymentSubTitle}>Client</h1>
		<Box sx={boxStyle}>
			<FormControl sx={formStyle} fullWidth>
				<InputLabel sx={labelStyle} id="poslabel">Client</InputLabel>
				<Select
				labelId="poslabel"
				id="demo-simple-select"
				sx={selectStyle}
				value={selectedClientId}
				label="Client"
				onChange={handleChange}
				>
				{
					clients.map((e,i) => {
						return <MenuItem key={i} value={e.id}>{e.nom}</MenuItem>
					})
				}
				
				</Select>
			</FormControl>
			</Box>
		</div>
		
		<hr className={styles.divider} />
		</div>

		<div className={styles.confirmationContainer}>
		<div className={styles.PavetSection}>
			<h1 className={'sectionTitle ' + styles.paymentSubTitle}>Confirmation</h1>
			<div className={styles.labelContainer}>
			<label className={styles.label}>Total</label>
		<input type="text" disabled={true} value={calculateTotal() * (1 - props.orderReduction / 100)} className={styles.inp} />
			</div>
			
		<br />
		<div className={styles.labelContainer}>
		<label className={styles.label}>Paid</label>
		
		<input type="text" disabled={false} id="paid" onClick={() => setSelectedId("paid")} value={paid} onChange={(e) => setPaid(Number(e.target.value))}  className={styles.inp} />
		</div>
			<div className={styles.PavetContainer}>
			<Pavet inpId={selectedId} />
			</div>
			
			</div>

			<hr className={styles.divider} />
			<div className={styles.buttonsContainer}>
			<div onClick={submit} className={'grid place-items-center w-[50%] my-3 '  }>
			<button  className="submit w-3/4 mx-auto">Submit</button>
			</div>
			<div onClick={() => props.setOrderStep("cart")} className={'grid place-items-center w-[50%] '  }>
			<button  className="cancel w-3/4 mx-auto">Cancel</button>
			</div>
			
			</div>
			
		</div>
	</motion.div>
	</>
	return html;


}