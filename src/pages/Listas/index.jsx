import React, { useState, useEffect } from 'react'
import { SwipeListView } from 'react-native-swipe-list-view'
import styled from 'styled-components/native'
import uuid from 'uuid/v4'
import AsyncStorage from '@react-native-community/async-storage'

import lista from './assets/listaScrol'
import ListItem from './components/ListaItem'
import ListaItemSwipe from './components/ListaItemSwipe'
import AddItemArea2 from './components/AddItemArea2'
import Modal from './components/Modal'

export default function Lista() {
  const [items, setItems] = useState(lista)
  const [modalTitle, setModalTitle] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const addNewItem = (txt) => {
    let newItems = [...items]
    newItems.push({
      id: uuid(),
      task: txt,
      done: false
    })
    setItems(newItems)
  }

  const toggleDone = (index) => {
    let newItems = [...items]
    newItems[index].done = !newItems[index].done
    setItems(newItems)
  }

  const deleteItem = async (index) => {
    let newItems = [...items]
    newItems = newItems.filter((it, newIndex) => newIndex != index)
    setItems(newItems)
  }

  const getItems = async () => {
    try {
      const itemsSaved = await AsyncStorage.getItem('@items')
      const parsed = JSON.parse(itemsSaved)
      setItems(parsed)
    } catch (error) {
      alert(error)
    }
  }

  const saveItems = async () => {
    let newItems = [...items]
    const storage = await AsyncStorage.setItem('@items', JSON.stringify(newItems))
  }

  const handleShowModal = () => {
    setModalTitle("Titulo aberto")
    setModalVisible(true)
  }


  useEffect(() => {
    getItems()
  }, [])

  return (
    <Page>
      <Modal
        title={modalTitle}
        visible={modalVisible}
        visibleAction={setModalVisible}
      >
        <Button title="Salvar" onPress={saveItems} />
      </Modal>
      <AddItemArea2 onAdd={addNewItem} />
      <Button title="Salvar" onPress={saveItems} />
      <Button title="Mostrar Modal" onPress={handleShowModal} />
      <SwipeListView
        data={items}
        renderItem={({ item, index }) => <ListItem onPress={() => toggleDone(index)} data={item} />}
        renderHiddenItem={({ item, index }) => <ListaItemSwipe onDelete={() => deleteItem(index)} />}
        leftOpenValue={50}
        keyExtractor={(item) => item.id}
        disableLeftSwipe={true}
      // rightOpenValue={-50}
      />
    </Page>
  )
}

const Page = styled.SafeAreaView`
  flex: 1;
`

const Button = styled.Button`
  width: 100%;
  margin: 30px 20px 30px;
`
