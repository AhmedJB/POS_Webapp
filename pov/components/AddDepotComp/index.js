import React, { useEffect, useState, Fragment, useContext } from "react";
import DepotEditableRow from "./DepotEditableRow";
import DepotReadOnly from "./DepotReadOnly";
import styles from "../../styles/modular/addUser/addUser.module.css";
import { style } from "@mui/system";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { UserContext } from "../../contexts/user";
import { PosContext } from "../../contexts/points";
import { delReq, postReq, req } from "../../utils/helper";
import { toast } from "react-toastify";

export default function AddDepotComp(props) {
  const [contacts, setcontacts] = useState([]);
  const [addFormData, setAddFormData] = useState({
    address: "",
    nom: "",
  });

  const [editFormData, setEditFormData] = useState({
    address: "",
    nom: "",
  });
  const [editContactId, setEditContactId] = useState(null);

  // contexts
  const { user, setUser } = useContext(UserContext);
  const { selectedPos, setSelectedPos } = useContext(PosContext);

  // fetching users
  const fetchUsers = async () => {
    let resp = await req("admin/depot/");
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
    let resp = await postReq("admin/depot/", addFormData);
    if (resp) {
      if (resp.failed) {
        toast.error("Failed saved depot");
      } else {
        toast.success("saved depot");
        fetchUsers();
        setAddFormData({
          address: "",
          nom: "",
        });
      }
    }
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      address: contact.address,
      nom: contact.nom,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = async (contactId) => {
    let resp = await delReq("admin/depot/" + contactId + "/");
    if (resp) {
      toast.success("deleted depot");
      fetchUsers();
    } else {
      toast.error("failed deleting depot");
    }
  };

  const html = (
    <>
      <div className={styles.parentcontainer}>
        <div className={styles.container}>
          <h2 className={styles.title}>Warehouse Management</h2>

          <div className={styles.tableau}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nom</Th>
                  <Th>Address</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {contacts.map((contact, i) => (
                  <Fragment key={i}>
                    {editContactId === contact.id ? (
                      <DepotEditableRow
                        key={i}
                        editFormData={editFormData}
                        contactId={contact.id}
                        handleEditFormchange={handleEditFormchange}
                        handleCancelClick={handleCancelClick}
                        refreshUsers={fetchUsers}
                      />
                    ) : (
                      <DepotReadOnly
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
            <h2 className={styles.title}>Add Warehouse</h2>
            <label>Nom</label>
            <input type="text" name="nom" onChange={handleAddFormchange} />
            <label>Address</label>
            <input type="text" name="address" onChange={handleAddFormchange} />

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
