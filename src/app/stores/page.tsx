'use client';
import StoreFormModal from "@/components/StoreModal";
import Layout from "@/components/Layout";
import { ICreateStoreRequest, ISubmitStoreFormRequest, IUpdateStoreRequest } from "@/interfaces/store";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteAlert } from "@/components/DeleteAlert";
import { useCreateStore } from "@/app/stores/use-create-store";
import { useUpdateStore } from "@/app/stores/use-update-store";
import { useDeleteStore } from "@/app/stores/use-delete-store";

const tdStandardStyle = { border: '1px solid', padding: '5px'}

export default function Store() {
  const supabase = createClient();
  const toast = useToast();
  const [stores, setStores] = useState([] as any[]);
  
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
  
  const createStore = useCreateStore(toast, fetchStores, supabase);
  const updateStore = useUpdateStore(toast, fetchStores, supabase);
  const deleteStore = useDeleteStore(toast, fetchStores, supabase);

  useEffect(() => {
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <StoreFormModal 
        title="Create new store" 
        isOpen={createStore.isOpen} 
        onClose={createStore.onClose} 
        onSubmit={createStore.submitNewStore} 
      />
      <StoreFormModal 
        title="Update store" 
        isOpen={updateStore.isOpen} 
        onClose={updateStore.handleEditClose} 
        onSubmit={updateStore.submitUpdateStore} 
        data={updateStore.currentEditForm} 
      />
      <DeleteAlert
        isOpen={deleteStore.isOpen}
        onClose={deleteStore.handleDeleteClose}
        onSubmit={deleteStore.submitDeleteStore}
        title="Delete Store"
        id={deleteStore.targetDeleteStoreId}
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
              onClick={createStore.onOpen}  
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
                        <td style={tdStandardStyle}>{item.id}</td>
                        <td style={tdStandardStyle}>{item.name}</td>
                        <td style={tdStandardStyle}>
                          <button 
                            onClick={() => updateStore.handleEdit({ id: item.id, name: item.name})} 
                            style={{backgroundColor: '#6a78a6', color: 'white'}}
                          >
                            Edit
                          </button>
                          |
                          <button 
                            onClick={() => deleteStore.handleOpenDeleteModal(item.id)} 
                            style={{backgroundColor: '#6a78a6', color: 'white'}}
                          >
                            Delete
                          </button>
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