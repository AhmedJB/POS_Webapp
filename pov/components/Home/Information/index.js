
import styles from "../../../styles/modular/Information/Information.module.css"
import {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Image from "next/image";

// icons
import Coin from "../../../assets/information/Coin.svg"
import Commande from "../../../assets/information/Commande.svg"
import User from "../../../assets/information/User.svg"
import AddIcon from '@mui/icons-material/Add';
import ModalComp from "../../General/ModalComp";
import { UserContext } from "../../../contexts/user";
import { PosContext } from "../../../contexts/points";
import { base_url, handleSingleFileSubmit , postReq, req } from "../../../utils/helper";
import { toast } from "react-toastify";



export default function Information(props){

	const {user,setUser} = useContext(UserContext);
	const {data,setData} = useContext(PosContext);
	const {selectedPos,setSelectedPos} = useContext(PosContext);

	/* const [data,setData] = useState([
		{
			value : 1,
			name : "test 1"
		},
		{
			value : 2,
			name : "test 2"
		},
		{
			value : 3,
			name : "test 3"
		},
		{
			value : 4,
			name : "test 4"
		}
	]); */

	const [selectedData,setSelectedData] = useState("");
	const [statistics,setStatistics] = useState(null);
	// modal state
	const [openModal,setOpenModal] = useState(false);

	function handleChange(e,value){
		console.log(e);
		console.log(value);
		setSelectedData(value.props.value);
		setSelectedPos(data.filter((e) => e.id == value.props.value)[0]);
	}

	const boxStyle = {
		width:"100%",
		maxWidth:"600px",
		bgcolor:"var(--main-dark)",
		borderRadius: 3
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



	// logic starts here
	useEffect(() => {
		getPOS().then((res) => {
			if (selectedPos){
				setSelectedData(selectedPos.id)
			}
			console.log("loaded pos")
		}
			);
	},[user])

	useEffect(() => {
		fetchStatistics().then(() => console.log("got stats"))
	},[selectedPos])

	const fetchStatistics = async () => {
		if (selectedPos){
			let body = {
				pov : selectedPos.id
			}
			let resp = await postReq("stats",body);
			if (resp){
				if (resp.failed){
					toast.error(resp.message)
	
				}else{
					setStatistics(resp)
				}
			}else{
				toast.error("failed")
			}
		}
		

	}

	const getPOS = async () => {
		let resp = await req("createpov");
		if (resp){
			toast.info("loaded pos");
			setData(resp);
		}else{
			toast.error("failed loading pos");
		}
	}

	const createPOV = async () => {
		let inps = document.querySelectorAll("#form-container input")
		let body = {}
		let imageFile;
		inps.forEach((inp) => {
			if (inp.type == "text"){
				body[inp.name] = inp.value
			}else{
				imageFile = inp.files[0];
			}
			 

		})
		let resp = await handleSingleFileSubmit(imageFile,"logo","createpov",body)
		if (resp){
			toast.success("Created POS")
			await getPOS();
		}else{
			toast.error("Failed creating POS")
		}
	}

	// html code here


	const html = <>
		<div className={styles.container + " shad "}>
			<div className="w-full flex items-center justify-center">
			<Box sx={boxStyle}>
			<FormControl sx={formStyle} fullWidth>
				<InputLabel sx={labelStyle} id="poslabel">Point of Sale</InputLabel>
				<Select
				labelId="poslabel"
				id="demo-simple-select"
				sx={selectStyle}
				value={selectedData}
				label="Point of Sale"
				onChange={handleChange}
				>
				{
					data.map((e,i) => {
						return <MenuItem key={i} value={e.id}>{e.nom}</MenuItem>
					})
				}
				
				</Select>
			</FormControl>
			</Box>
			{ ['super'].includes(user.role) && <span className={styles.validate} onClick={() => setOpenModal(true)}>
				
				<AddIcon className={styles.icon}></AddIcon>
			</span> }
			
			</div>
		
				{
					data.length > 0 && selectedData && <>
						<div className={"card " + styles.card }	>
				<div className={styles.imageContainer}>
					<Image src={ base_url + selectedPos.logo} className={styles.image} width={200} height={200} />
				</div>
				<div className={styles.informationContainer}>
					<h1 className="title my-2">
						{selectedPos.nom}
					</h1>
					<p className="description my-2">
					{selectedPos.address}
					</p>
					{/* <p className="description my-2">
					0592473898
					</p> */}

				</div>

			</div>	

					{
						statistics && <div className={styles.cardsContainer}>
						<div className={styles.subCard + " mx-4 my-2 shad"}>
							<div className={styles.iconContainer}>
								<Image src={Coin} width={32} height={32} />
							</div>
							<div className={styles.textContainer}>
							<p className="text-2xl text-white font-semibold my-3" >{statistics.profit} MAD</p>
							<p className="text-md text-[#ffffffc4] font-regular" >Profit/24h</p>
							</div>
							
		
						</div>
						<div className={styles.subCard + " mx-4 my-2 shad"}>
							<div className={styles.iconContainer}>
								<Image src={Commande} width={26} height={26} />
							</div>
							<div className={styles.textContainer}>
							<p className="text-2xl text-white font-semibold my-3" >{statistics.orders}</p>
							<p className="text-md text-[#ffffffc4] font-regular" >Commandes/24h</p>
							</div>
							
		
						</div>
						<div className={styles.subCard + " mx-4 my-2 shad"}>
							<div className={styles.iconContainer}>
								<Image src={User} width={26} height={26} />
							</div>
							<div className={styles.textContainer}>
							<p className="text-2xl text-white font-semibold my-3" >{statistics.clients}</p>
							<p className="text-md text-[#ffffffc4] font-regular" >Customers</p>
							</div>
							
		
						</div>
					</div>
					}
			
					</>
					
				}
			


		</div>

				<ModalComp open={openModal} close={() => setOpenModal(false)}>
					<div className="flex flex-col ">
						<h1 className="text-2xl text-orange text-center">Add a Point of sale</h1>
						<div id="form-container" className="w-full p-3">
							<input className="p-3 outline-none bg-mainDark w-full rounded-[5px] my-3 text-white text-lg" placeholder="Name" type="text" name="nom"></input>
							<input className="p-3 outline-none bg-mainDark w-full rounded-[5px] my-3 text-white text-lg" placeholder="Address" type="text" name="address"></input>
							<label htmlFor="file" className="p-2 bg-orange text-white rounded-[5px] my-3 cursor-pointer">POV Image</label>
							<input name="image" hidden={true} id="file" type="file" className="bg-transparent" />
							<br />
							
						</div>
						<button className="self-center p-3 my-3 rounded-[5px] text-white bg-orange w-[200px]" onClick={createPOV}>Save</button>
					</div>
				</ModalComp>

	</>

	return html;

}