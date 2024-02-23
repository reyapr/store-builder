'use client';
import StoreFormModal from "@/components/StoreModal";
import Layout from "@/components/Layout";
import { ICreateStoreRequest, ISubmitStoreFormRequest, IUpdateStoreRequest } from "@/interfaces/store";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteAlert } from "@/components/DeleteAlert";

const tdStandardStyle = { border: '1px solid', padding: '5px'}

export default function Store() {
  const supabase = createClient();
  const newFormModal = useDisclosure();
  const updateFormModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [currentEditForm, setCurrentEditForm] = useState({
    id: '',
    name: '',
  } as IUpdateStoreRequest);
  const [targetDeleteStoreId, setTargetDeleteStoreId] = useState('' as string);
  
  const [stores, setStores] = useState([] as any[]);
  const toast = useToast();
  
  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/store');
      
      setStores(response.data.stores);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  }
  
  const submitNewStore = (request: ISubmitStoreFormRequest) => async () => {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    const storRequest = { name: request.name, email: user?.email } as ICreateStoreRequest;
    
    try {
      await axios.post('/api/store', storRequest);
      fetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
      
    }
    newFormModal.onClose();
  }
  
  const submitUpdateStore = (request: ISubmitStoreFormRequest) => async () => {
    try {
      await axios.patch('/api/store', request);
      fetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
    handleEditClose();
  }
  
  const handleEdit = (request: IUpdateStoreRequest) => {
    setCurrentEditForm(request);
    
    updateFormModal.onOpen();
  }
  
  const handleOpenDeleteModal = (id: string) => {
    setTargetDeleteStoreId(id);
    deleteModal.onOpen();
  }
  
  const handleEditClose = () => {
    setCurrentEditForm({ id: '', name: ''})
    updateFormModal.onClose();
  }
  
  const handleDeleteClose = () => {
    setTargetDeleteStoreId('');
    deleteModal.onClose();
  }
  
  const submitDeleteStore = (id: string) => async () => {
    try {
      await axios.delete(`/api/store/${id}`);
      fetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
    handleDeleteClose();
  }
  
  useEffect(() => {
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <StoreFormModal 
        title="Create new store" 
        isOpen={newFormModal.isOpen} 
        onClose={newFormModal.onClose} 
        onSubmit={submitNewStore} 
      />
      <StoreFormModal 
        title="Update store" 
        isOpen={updateFormModal.isOpen} 
        onClose={handleEditClose} 
        onSubmit={submitUpdateStore} 
        data={currentEditForm} 
      />
      <DeleteAlert
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteClose}
        onSubmit={submitDeleteStore}
        title="Delete Store"
        id={targetDeleteStoreId}
      />
      <div 
        style={{ 
          display: 'flex', 
          flex: 11, 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div>
          <b>Store</b>
        </div>
        <div>
          <div>
            <button 
              onClick={newFormModal.onOpen}  
              style={{backgroundColor: '#6a78a6', color: 'white'}}
            >
              Create Store
            </button>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th style={tdStandardStyle}>ID</th>
                  <th style={tdStandardStyle}>Name</th>
                  <th style={tdStandardStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  stores.sort((a,b) => a.id > b.id ? -1 : 1).map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td  style={tdStandardStyle}>{item.id}</td>
                        <td  style={tdStandardStyle}>{item.name}</td>
                        <td  style={tdStandardStyle}>
                          <button onClick={() => handleEdit({ id: item.id, name: item.name})} style={{backgroundColor: '#6a78a6', color: 'white'}}>Edit</button>
                          |
                          <button onClick={() => handleOpenDeleteModal(item.id)} style={{backgroundColor: '#6a78a6', color: 'white'}}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}