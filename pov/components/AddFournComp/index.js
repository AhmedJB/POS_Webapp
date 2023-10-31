import React, { useEffect, useState, Fragment, useContext } from "react";
import FournEditableRow from "./FournEditableRow";
import FournReadOnly from "./FournReadOnly";
import styles from "../../styles/modular/addUser/addUser.module.css";
import { style } from "@mui/system";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserContext } from "../../contexts/user";
import { PosContext } from "../../contexts/points";
import { delReq, postReq, req } from "../../utils/helper";
import { toast } from "react-toastify";

export default function AddFournComp(props) {
  const [contacts, setcontacts] = useState([]);
  const [addFormData, setAddFormData] = useState({
    prenom: "",
    nom: "",
  });

  const [editFormData, setEditFormData] = useState({
    prenom: "",
    nom: "",
  });
  const [editContactId, setEditContactId] = useState(null);

  // contexts
  const { user, setUser } = useContext(UserContext);
  const { selectedPos, setSelectedPos } = useContext(PosContext);

  // fetching users
  const fetchUsers = async () => {
    let resp = await req("fournisseur?pid=" + selectedPos.id);
    if (resp) {
      setcontacts(resp);
    } else {
      toast.error("failed loading data");
    }
  };

  useEffect(() => {
    fetchUsers().then(() => console.log("done loading data"));
  }, [user, selectedPos]);

  const handleAddFormchange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormchange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = async (event) => {
    addFormData["pov"] = selectedPos.id;
    let resp = await postReq("fournisseur/", addFormData);
    if (resp) {
      if (resp.failed) {
        toast.error("Failed saved user");
      } else {
        toast.success("saved fournisseur");
        fetchUsers();
        setAddFormData({
          prenom: "",
          nom: "",
        });
      }
    }
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      prenom: contact.prenom,
      nom: contact.nom,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = async (contactId) => {
    let resp = await delReq("fournisseur/" + contactId + "/");
    if (resp) {
      toast.success("deleted fournisseur");
      fetchUsers();
    } else {
      toast.error("failed deleting fournisseur");
    }
  };

  const html = (
    <>
      <div className={styles.parentcontainer}>
        <div className={styles.container}>
          <h2 className={styles.title}>Suppliers Management</h2>

          <div className={styles.tableau}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Prenom</Th>

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {contacts.map((contact, i) => (
                  <Fragment key={i}>
                    {editContactId === contact.id ? (
                      <FournEditableRow
                        key={i}
                        editFormData={editFormData}
                        contactId={contact.id}
                        handleEditFormchange={handleEditFormchange}
                        handleCancelClick={handleCancelClick}
                        refreshUsers={fetchUsers}
                      />
                    ) : (
                      <FournReadOnly
                        key={i}
                        contact={contact}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                      />
                    )}
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </div>
          <div className={styles.addContainer}>
            <h2 className={styles.title}>Add Supplier</h2>
            <label>Nom</label>
            <input type="text" name="nom" onChange={handleAddFormchange} />
            <label>Prenom</label>
            <input type="text" name="prenom" onChange={handleAddFormchange} />

            <button
              onClick={handleAddFormSubmit}
              type="submit"
              className={styles.button}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return html;
}
