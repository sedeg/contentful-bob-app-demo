import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';

import { Button, Heading, WorkbenchHeader } from '@contentful/forma-36-react-components';
import { PageExtensionSDK, CollectionResponse, ContentType } from '@contentful/app-sdk';

import MP from '../components/MP';
import CYO from '../components/CYO';
import Details from './Details';

interface PageProps {
  sdk: PageExtensionSDK;
}

interface InvocationParams {
  path: string;
}

function NotFound() {
  return <Heading>404</Heading>;
}

export default class Page extends Component<PageProps, { contentTypes: ContentType[] }> {
  history: MemoryHistory;

  constructor(props: PageProps) {
    super(props);

    const invocationParams = props.sdk.parameters.invocation as InvocationParams;

    this.history = createMemoryHistory({
      initialEntries: [invocationParams.path],
    });

    this.history.listen((location) => {
      this.props.sdk.navigator.openCurrentAppPage({ path: location.pathname });
    });

    this.state = {
      contentTypes: [],
    };
  }

  async componentDidMount() {
    // Fetch our content types so we know which data to display.
    const allContentTypes =
      (await this.props.sdk.space.getContentTypes()) as CollectionResponse<ContentType>;

    this.setState({ contentTypes: allContentTypes.items });
  }

  render = () => {
    return (
      <div className="page">
        <Router history={this.history}>
          <Route
            render={(props) => (
              <WorkbenchHeader
                title={'Bob - Contentful'}
                actions={
                  <>
                    <Button
                      buttonType="muted"
                      onClick={() => {
                        props.history.push('/');
                      }}>
                      MP
                    </Button>
                    <Button
                      buttonType="muted"
                      onClick={() => {
                        props.history.push('/incomplete');
                      }}>
                      CYO
                    </Button>
                  </>
                }
              />
            )}
          />
          <Switch>
            <Route
              path="/"
              exact
              children={<MP sdk={this.props.sdk} contentTypes={this.state.contentTypes} />}
            />
            <Route
              path="/incomplete"
              exact
              children={<CYO sdk={this.props.sdk} contentTypes={this.state.contentTypes} />}
            />
            <Route path="/details/:id" exact children={<Details sdk={this.props.sdk} />} />
            <Route render={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  };
}
