import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';


export default function ModalComp(props){
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		maxWidth:"100%",
		maxHeight:"100vh",
		bgcolor: 'var(--main-light)',
		border: '0px solid #000',
		outline: "none",
		borderRadius: 3,
		boxShadow: 24,
		p: 4,
	  };
	return  <>
	<Modal
	  open={props.open}
	  onClose={props.close}
	  aria-labelledby="modal-modal-title"
	  aria-describedby="modal-modal-description"
	>
	  <Box sx={props.style ? props.style : style}>
	  		{props.children}
	  </Box>
	</Modal>
	</>

}