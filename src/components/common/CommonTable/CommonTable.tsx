import { Table } from 'react-bootstrap';
import './CommonTable.scss';
import { ReactNode } from 'react';
import Shimmer from '../Shimmer/Shimmer';

type propTypes = {
    className?: string,
    fields?: { label?: string, icon?: ReactNode, }[]
    children?: ReactNode,
    loading?: boolean,
}

const CommonTable = (props: propTypes) => {
    return (
        <>
            <Table responsive className={`commonTable ${props.loading ? "loading_table" : ""} ${props.className || ""}`}>
                {
                    props.fields &&
                    <thead>
                        <tr>
                            {props.fields?.map(item => (
                                <th key={item.label}>
                                    {item.label}
                                    {
                                        item.icon &&
                                        <span className='iconSec'>{item.icon}</span>
                                    }
                                </th>
                            ))}
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                        props.loading ?
                            Array.from({ length: 4 }).map((item, index) => {
                                return (
                                    <tr key={String(item) + index}>
                                        {
                                            Array.from({ length: props.fields?.length || 1 }).map((item, index) => {
                                                return (
                                                    <td key={String(item) + index}>
                                                        <Shimmer
                                                            width={150}
                                                            height={20}
                                                        />
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                            :
                            props.children
                    }
                </tbody>
            </Table >
        </>
    )
}

export default CommonTable