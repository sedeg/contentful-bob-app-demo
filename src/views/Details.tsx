import React from 'react';
import { useParams } from 'react-router-dom';
import { PageExtensionSDK } from '@contentful/app-sdk';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  WorkbenchSidebar,
  WorkbenchContent,
  TextInput,
  Button,
  SectionHeading,
} from '@contentful/forma-36-react-components';

interface DetailsProps {
  sdk: PageExtensionSDK;
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
`;

const StyledWorkbenchSidebar = styled(WorkbenchSidebar)`
  display: flex;
  flex-direction: column;
  width: 280px;
`;

const StyledWorkbenchContent = styled(WorkbenchContent)`
  padding: 0;
  iframe {
    width: 100%;
    height: calc(100vh - 56px);
  }
`;

const Settings = styled.div`
  flex: 1 0 auto;
  margin: 0 0 32px;
  width: 100%;
`;
const Buttons = styled.div`
  margin-top: auto;
`;

const Details = ({ sdk }: DetailsProps) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({});
  const [title, setTitle] = useState('');
  const [cacheBust, setCacheBust] = useState(0);

  useEffect(() => {
    sdk.space
      .getEntry(id)
      .then((entry: any) => {
        console.log('entry', entry);
        setPage(entry);
        setTitle(entry.fields.title.de);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const onUpdate = async () => {
    if (page) {
      const newPage = { ...(page as any) };
      newPage.fields.title['de'] = title;
      sdk.space
        .updateEntry(page)
        .then((entry: any) => {
          console.log(`Entry ${entry.sys.id} updated.`);
          setPage(entry);
          setCacheBust(cacheBust + 1);
        })
        .catch(console.error);
    }
  };

  const addUsps = async () => {
    await sdk.space
      .createEntry('bobUsPs', {
        fields: {
          usPs: { de: `USPs-${cacheBust}` },
        },
      })
      .then((entry: any) => {
        const newPage = { ...(page as any) };

        if ('usPs' in newPage.fields) {
          console.log('key exists');
        } else {
          newPage.fields.usPs = {};
          newPage.fields.usPs.de = [];
          console.log('unknown key');
        }

        newPage.fields.usPs['de'].push({
          sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id },
        });
        setPage(newPage);
      })
      .catch(console.error);

    sdk.space
      .updateEntry(page)
      .then((entry: any) => {
        console.log(`Entry ${entry.sys.id} updated.`);
        setPage(entry);
        setCacheBust(cacheBust + 1);
      })
      .catch(console.error);
  };

  return (
    <>
      {!loading && (
        <Wrapper>
          <StyledWorkbenchSidebar width="280px">
            <Settings>
              <SectionHeading>Title</SectionHeading>
              <TextInput
                name="page_title"
                width="full"
                type="text"
                value={title}
                className="f36-margin-top--m f36-margin-bottom--l"
                onChange={(event) => setTitle(event.target.value)}
              />
              <Button buttonType="muted" onClick={addUsps}>
                Add fancy USPs
              </Button>
            </Settings>
            <Buttons>
              <Button buttonType="positive" onClick={onUpdate}>
                Save
              </Button>
            </Buttons>
          </StyledWorkbenchSidebar>
          <StyledWorkbenchContent>
            <iframe
              title="preview"
              src={`http://localhost:3000/bob/earth-week?preview=1&cb=${cacheBust}`}
            />
          </StyledWorkbenchContent>
        </Wrapper>
      )}
    </>
  );
};

export default Details;
