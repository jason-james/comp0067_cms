import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from "axios";
import { Link } from "react-router-dom";

export class AllArticles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
        }
    }

    async componentDidMount() {
        let res = await axios.get('/api/getUserInfo');
        let userInfo = res.data;
        res = await axios.get('/api/getSingleUserArticles', {params: {userInfo}});
        await this.setState({tableData: res.data})
    }

    buttonFormatter = (cell, row) => {
        return (
                <div className=''>
                    <Link to={`/edit_article?article=${row.article_id}`}><button type="button" className="btn btn-primary mx-1">Edit</button></Link>
                    <button type="button" className="btn btn-danger mx-1">Delete</button>
                </div>
            )
        };

    render() {
        const columns = [
            {
                dataField: "article_id",
                hidden: true
            },
            {
                dataField: "title",
                text: "Title",
                filter: textFilter()
            },
            {
                dataField: "last_saved",
                text: "Last Saved"
            },
            {
                dataField: "date_added",
                text: "Date Added To App"
            },
            {
                dataField: "author",
                text: "Author",
                filter: textFilter()
            },
            {
                dataField: "status",
                text: "Status"
            },
            {
                dataField: 'actions',
                text: 'Actions',
                isDummyField: true,
                csvExport: false,
                formatter: this.buttonFormatter,
            }
        ];
        return (
            <div className='container d-flex justify-content-center my-4'>
                <div className='row'>
                    <BootstrapTable
                        keyField="id"
                        data={this.state.tableData}
                        columns={columns}
                        filter={ filterFactory() }
                        striped
                        hover
                        condensed
                    />
                </div>
            </div>
        )
    }
}