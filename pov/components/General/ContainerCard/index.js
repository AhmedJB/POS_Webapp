import styles from "../../../styles/modular/ContainerCard/ContainerCard.module.css"


export default function ContainerCard(props){

	const html = <>
	<div className="generalContainer">
		{props.children}
	</div>
	</>


	return html;



}