import { Card, TextField } from '@material-ui/core'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useAccount } from 'wagmi'
const DropDown = (props) => {
    const { masterTableData, setData, data } = props
    const { address } = useAccount()
    const [filteredData, setFilteredData] = React.useState(masterTableData)
    const [textFieldVal, setTextFieldVal] = React.useState()

    const allData = () => {
        return setFilteredData(masterTableData)
    }
    const noData = () => {
        return setFilteredData("")
    }

    const filterData = (value) => {
        setFilteredData(masterTableData.filter(
            each => {
                return (each[0] + " " + each[2]).toLowerCase().includes(value.toLowerCase())
            }
        ))
    }

    return (
        <>
            <h3 className='text-center'>Seach For A product</h3>
            <TextField variant="outlined" placeholder='Search for a product' value={textFieldVal} onFocus={() => allData()} onChange={(e) => {
                setTextFieldVal(e.target.value)
                console.log(e.target.value)
                filterData(e.target.value)
            }} fullWidth className='mt-1' />
            {
                <Card className='mt-3 dropdown-height'>
                    {
                        filteredData.map(each => {
                            return <p className='border-bottom-1 p-3 hover' onClick={() => { setData(each); setTextFieldVal("") }}>{each[0] + " " + each[2]}</p>
                        })
                    }
                </Card>
            }
        </>


        // <Dropdown>
        //     <Dropdown.Toggle variant="primary" id="dropdown-basic">
        //         {
        //             data?data[0]:"Select"
        //         }
        //     </Dropdown.Toggle>
        //     <Dropdown.Menu>
        //         {address &&
        //             masterTableData.map((product) => {
        //                 return <Dropdown.Item key={product["PoID"]} onClick={() => {
        //                     setData(product)
        //                 }}>{product["PoID"] + " " + product[2]}</Dropdown.Item>
        //             })}
        //     </Dropdown.Menu>
        // </Dropdown>
    )
}

export default DropDown
