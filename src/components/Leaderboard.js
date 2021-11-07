import React, { Component } from 'react'
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import events from '../data/events.json';
import session from '../api/session';
import Popup from 'reactjs-popup';
import { Card, CardContent, Dialog, Link, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';


import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const context = require.context('../data/sessionData', true, /.json$/);
const allSessions = {};
context.keys().forEach((key) => {
    const fileName = key.replace('./', '');
    const resource = require(`../data/sessionData/${fileName}`);
    const namespace = fileName.replace('.json', '');
    allSessions[namespace] = JSON.parse(JSON.stringify(resource));

});

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class Prizes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prizeTable: <LinearProgress />,
            prizeData: undefined,
        };
    }

    setPrizeData(value) {
        this.setState({
            prizeData: value
        });

        this.generatePrizeTable(value)
    }

    generatePrizeTable = (prizeData) => {
        let prizeTable = <div></div>
        let prizeDistribution = this.props.eventData.data.prize
        let prizeTotal = this.props.eventData.data.prize_total.toString().replace(/\D/g, '');
        let totalDrivers = prizeData.total
        let hiredDrivers = prizeData.hired
        let ownerDrivers = prizeData.owner
        let splitLeaderboard = false
        if (this.props.eventData.data.splitLeaderboard) { splitLeaderboard = true }
        if (totalDrivers > 0) {
            let ownerPercentage = (ownerDrivers / totalDrivers)
            let hiredPercentage = (hiredDrivers / totalDrivers)
            let halfSplit = false
            if (!this.props.eventData.data.dynamicPrizePoolRatio) {
                ownerPercentage = 0.5
                hiredPercentage = 0.5
                halfSplit = true
            }

            let rankRange = false
            for (const i in prizeDistribution) {
                let peoplePerPrize = 1
                if (prizeDistribution[i].prize < 1 || halfSplit) {
                    if (i < prizeDistribution.length - 1) {
                        let j = parseInt(i) + 1
                        if (prizeDistribution[j].rank - prizeDistribution[i].rank > 1) {
                            rankRange = true
                            prizeDistribution[i].rankString = prizeDistribution[i].rank.toString() + ' - ' + (prizeDistribution[j].rank - 1).toString()
                            peoplePerPrize = parseInt(prizeDistribution[j].rank) - parseInt(prizeDistribution[i].rank)
                        }
                    } else {
                        if (rankRange) {
                            prizeDistribution[i].rankString = prizeDistribution[i].rank.toString() + '+*'
                            peoplePerPrize = 3000
                        }
                    }

                    if (!prizeDistribution[i].rankString) {
                        prizeDistribution[i].rankString = prizeDistribution[i].rank.toString()
                    }

                    let currentPrize = prizeDistribution[i].prize * (halfSplit ? 1 : prizeTotal)
                    prizeDistribution[i].hiredPrize = (hiredPercentage * currentPrize / peoplePerPrize).toFixed(2)
                    prizeDistribution[i].ownerPrize = (ownerPercentage * currentPrize / peoplePerPrize).toFixed(2)

                }
            }

            prizeTable = <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Driver Prize {splitLeaderboard && '(' + (ownerPercentage * 100).toFixed(2) + '%)'}</TableCell>
                        {splitLeaderboard && <TableCell>Hired Prize ({(hiredPercentage * 100).toFixed(2)}%)</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        prizeDistribution.map((prizeRow) => (

                            <TableRow>
                                <TableCell>
                                    {prizeRow.rankString ? prizeRow.rankString : prizeRow.rank}
                                </TableCell>
                                <TableCell>
                                    {splitLeaderboard ? prizeRow.ownerPrize : prizeRow.prize}
                                </TableCell>
                                {splitLeaderboard && <TableCell>
                                    {prizeRow.hiredPrize}
                                </TableCell>}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        } else {
            prizeTable = <Card sx={{ minWidth: 275 }}>
                <CardContent align="center">
                    <h1>Prize Data Not Available</h1>
                </CardContent>
            </Card>
        }


        this.setState({
            prizeTable: prizeTable
        })
    }

    getPrizeData = async () => {
        let prizeData;
        let sessionID = this.props.eventData.id.toUpperCase();
        if (localStorage.getItem(sessionID)) {
            prizeData = JSON.parse(localStorage.getItem(sessionID))
            this.setPrizeData(prizeData);
        } else {
            prizeData = allSessions[sessionID]
            if (prizeData.total > 0) {
                localStorage.setItem(sessionID, JSON.stringify(prizeData));
            }
            this.setPrizeData(prizeData);
        }
    }

    componentDidMount() {
        this.getPrizeData()
    }

    render() {
        return <div>{this.state.prizeTable}</div>
    }
}

const columns = [
    { title: "Series", field: "data.series", hidden: true },
    { title: "Name", field: "data.name" },
    {
        title: "View Pizes", field: "", render: rowData => {
            if (new Date(rowData.endTimestamp).getTime() < new Date().getTime()) {
                return <Popup trigger={<Link href="#">View Prizes</Link>} position="bottom center" >
                    <Dialog open fullWidth>
                        <Prizes eventData={rowData} />
                    </Dialog>
                </Popup>
            } else {
                return <div>{new Date(rowData.startTimestamp).getTime() < new Date().getTime() ? 'In Progress' : 'Upcoming'}...</div>
            }
        }
    },
    { title: "Start", field: "startTimestamp", type: "date" },
    { title: "End", field: "endTimestamp", type: "date" },
    { title: "Track", field: "data.track" },
    { title: "Laps", field: "data.lapCount" },
    { title: "Weather", field: "data.weather" },
    { title: "Total Prize", field: "data.prize_total" },
    { title: "id", field: "id", hidden: true },
    { title: "percentagePrizePool", field: "data.percentagePrizePool", hidden: true },
    { title: "dynamicPrizePoolRatio", field: "data.dynamicPrizePoolRatio", hidden: true },
    { title: "splitLeaderboard", field: "data.splitLeaderboard", hidden: true },
];

function needsUpdate() {
    const expirationDuration = 1000 * 60 * 60 * 24; // 12 hours

    const prevAccepted = localStorage.getItem("accepted");
    const currentTime = new Date().getTime();

    const notAccepted = prevAccepted === undefined;
    const prevAcceptedExpired = prevAccepted !== undefined && currentTime - prevAccepted > expirationDuration;
    if (notAccepted || prevAcceptedExpired) {
        localStorage.setItem("accepted", currentTime);
        return true;
    }

    return false;
}

function formatEventData(eventData) {
    eventData.map(singleDataPoint => {
        singleDataPoint.startTimestamp = new Date(singleDataPoint.startTimestamp)
        singleDataPoint.endTimestamp = new Date(singleDataPoint.endTimestamp)
        return singleDataPoint
    })

    eventData.sort(function (a, b) {
        return new Date(b.startTimestamp) - new Date(a.startTimestamp);
    });

    return eventData;
}


export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventData: undefined,
            eventDataLoaded: false,
        };
    }

    setEventData(eventData) {
        this.setState({ eventData: eventData })
    }

    setEventDataLoaded(value) {
        this.setState({ eventDataLoaded: value })
    }

    BasicTable = async () => {
        let eventData;
        if (needsUpdate() || !localStorage.getItem("events")) {
            eventData = events
            eventData = formatEventData(eventData);
            this.setEventData(eventData);
            this.setEventDataLoaded(true);
            localStorage.setItem("events", JSON.stringify(eventData));
        } else {
            eventData = JSON.parse(localStorage.getItem("events"));
            this.setEventData(eventData);
            this.setEventDataLoaded(true);
        }
    };

    componentDidMount() {
        this.BasicTable();
    }

    render() {
        return (
            <div>
                <MaterialTable
                    title="REVV Leaderboards"
                    columns={columns}
                    data={this.state.eventData}
                    icons={tableIcons}
                    isLoading={!this.state.eventDataLoaded}
                    options={{
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, { value: this.state.eventData ? parseInt(this.state.eventData.length) : 0, label: 'All' }],
                    }}
                />
            </div>
        )
    }
}
