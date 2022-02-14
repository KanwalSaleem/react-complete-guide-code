// material
import { useEffect } from "react";
import { connect } from "react-redux"
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
    AppWelcome,
    AppWidgets1,
    AppWidgets2,
    AppFeatured,
    AppNewInvoice,
    AppTopAuthors,
    AppTopRelated,
    AppAreaInstalled,
    AppTotalDownloads,
    AppTotalInstalled,
    AppCurrentDownload,
    AppTotalActiveUsers,
    AppTopInstalledCountries
} from '../../components/_dashboard/general-app';
import { getProject_user } from "../../project_actions"
// ----------------------------------------------------------------------

function GeneralApp(props) {

    const { themeStretch } = useSettings();
    const { user } = useAuth();
    // useEffect(() => {
    //     props.getProject_user()
    // },[])

    return (
        <Page title="General: App">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <AppWelcome displayName={"Mukesh Kumar"} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <AppFeatured />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppTotalActiveUsers />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppTotalInstalled />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <AppTotalDownloads />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentDownload />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppAreaInstalled />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <AppNewInvoice />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopRelated />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopInstalledCountries />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppTopAuthors />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Stack spacing={3}>
                            <AppWidgets1 />
                            <AppWidgets2 />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
function mapStateToProps(state) {
    // console.log(' state calling ====>', state)
    return {
        state
    };
}

export default connect(mapStateToProps, {
    getProject_user
})(GeneralApp)
