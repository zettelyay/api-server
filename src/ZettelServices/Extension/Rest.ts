import { ZettelTypes, version } from '@zettelooo/api-types'
import axios from 'axios'
import { apiConfig } from '../../apiConfig'

export class Rest<PD = any, CD = any, BD = any> {
  private baseUrl: string

  constructor(private readonly options: Rest.Options) {
    this.baseUrl =
      options.extensionRestApi?.baseUrl ||
      apiConfig.baseUrlsByTargetEnvironment[options.extensionRestApi?.targetEnvironment ?? 'live'].rest
  }

  private requestFactory<Request, Response>(endPoint: string): (request: Request) => Promise<Response> {
    return async request => {
      const response = await axios({
        url: `${this.baseUrl}/${version}/rest/extension/${endPoint}`,
        method: 'POST',
        headers: {
          Authorization: `Key ${this.options.extensionAccessKey}`,
        },
        data: request,
      })
      return response.data
    }
  }

  getUsers = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetUsers.Request,
    ZettelTypes.Service.Extension.Rest.GetUsers.Response
  >('get-users')

  getPages = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetPages.Request,
    ZettelTypes.Service.Extension.Rest.GetPages.Response<PD>
  >('get-pages')

  getPageMembers = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetPageMembers.Request,
    ZettelTypes.Service.Extension.Rest.GetPageMembers.Response
  >('get-page-members')

  getCards = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.GetCards.Request,
    ZettelTypes.Service.Extension.Rest.GetCards.Response<CD, BD>
  >('get-cards')

  setPageExtensionData = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.SetPageExtensionData.Request<PD>,
    ZettelTypes.Service.Extension.Rest.SetPageExtensionData.Response
  >('set-page-extension-data')

  setCardExtensionData = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.SetCardExtensionData.Request<CD>,
    ZettelTypes.Service.Extension.Rest.SetCardExtensionData.Response
  >('set-card-extension-data')

  setCardBlockExtensionData = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.SetCardBlockExtensionData.Request<BD>,
    ZettelTypes.Service.Extension.Rest.SetCardBlockExtensionData.Response
  >('set-card-block-extension-data')

  addPage = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.AddPage.Request<PD>,
    ZettelTypes.Service.Extension.Rest.AddPage.Response
  >('add-page')

  editPage = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.EditPage.Request<PD>,
    ZettelTypes.Service.Extension.Rest.EditPage.Response
  >('edit-page')

  addCard = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.AddCard.Request<CD, BD>,
    ZettelTypes.Service.Extension.Rest.AddCard.Response
  >('add-card')

  editCard = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.EditCard.Request<CD, BD>,
    ZettelTypes.Service.Extension.Rest.EditCard.Response
  >('edit-card')

  addBadge = this.requestFactory<
    ZettelTypes.Service.Extension.Rest.AddBadge.Request,
    ZettelTypes.Service.Extension.Rest.AddBadge.Response
  >('add-badge')
}

export namespace Rest {
  export interface Options {
    readonly extensionRestApi?: {
      readonly baseUrl?: string
      readonly targetEnvironment?: keyof typeof apiConfig.baseUrlsByTargetEnvironment
    }
    readonly extensionAccessKey: string
  }
}
