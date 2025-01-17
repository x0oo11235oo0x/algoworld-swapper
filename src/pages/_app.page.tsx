/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider } from 'react-redux';
import darkTheme from '../redux/theme/darkTheme';
import createEmotionCache from '../utils/createEmotionCache';
import { SnackbarProvider } from 'notistack';
import Layout from '@/components/Layouts/Layout';
import store from '@/redux/store';
import { ConnectContext, connector } from '@/redux/store/connector';
import { Slide } from '@mui/material';
import { GoogleAnalytics } from 'nextjs-google-analytics';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="⚡️ Free and trustless ASA swapper, powered by Algorand"
        />
        <meta
          name="keywords"
          content="Algorand, AlgoWorld, Swapper, ASA, NFT, Blockchain"
        />
        <title>AlgoWorld Swapper</title>

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Provider store={store}>
        <ConnectContext.Provider value={connector}>
          <ThemeProvider theme={darkTheme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: `bottom`,
                horizontal: `center`,
              }}
              TransitionComponent={Slide}
            >
              <CssBaseline />
              <Layout title="AlgoWorld Swapper">
                <>
                  <GoogleAnalytics />
                  <Component {...pageProps} />
                </>
              </Layout>
            </SnackbarProvider>
          </ThemeProvider>
        </ConnectContext.Provider>
      </Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
