import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { BddService } from '@service/db/db.service';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { LoggerService } from '@service/logger/logger.service';
import { GetUserUsecase } from '@usecase/user/get.user.usecase';
import { AuthPasskeyUsecase } from '@usecase/auth/passkey.auth.usecase';
import { PasswordLessService } from '@service/passwordless/passwordless.service';

describe('AuthPasskeyUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockBddService: MockProxy<BddService> = mock<BddService>();
  const mockLoggerService: MockProxy<LoggerService> = mock<LoggerService>();
  const mockGetUserUsecase: MockProxy<GetUserUsecase> = mock<GetUserUsecase>();
  const mockPasswordLessService: MockProxy<PasswordLessService> = mock<PasswordLessService>();

  mockInversify.bddService = mockBddService;
  mockInversify.loggerService = mockLoggerService;
  mockInversify.getUserUsecase = mockGetUserUsecase;
  mockInversify.passwordLessService = mockPasswordLessService;

  const usecase: AuthPasskeyUsecase = new AuthPasskeyUsecase(mockInversify);

  describe('#execute', () => {

    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should get response of auth', async () => {
      // arrange
      const data = {
        id: '65d4d015261e894a1da31a65',
        code: 'faro',
        name_first: 'Fabrice',
        name_last: 'Rosito',
        description: 'Admin',
        mail: 'fabrice.rosito@gmail.com',
        role: 'USER',
      };
      mockGetUserUsecase.execute.mockResolvedValue({
        active: true,
        password: 'password',
        ...data,
        role: USER_ROLE.USER,
      });
      mockBddService.getPasskey.mockResolvedValue({
        id: '66098fdbf598ac342a811959',
        label: 'test',
        hostname: 'localhost',
        challenge: 'af54970f-9beb-423d-afd5-7f5a33b8d26f',
        registration: {
            username: 'admin',
            credential: {
                id: 'z2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbecs',
                publicKey: 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwxiYZyHsVm2JhS_2jPPBHERMVMqb-Zv3xfsAjqDcUSpWAeAFrZ65LSOohcR2-DmHZNlpTZv0wYw5J0NaxBU2Kg==',
                algorithm: 'ES256'
            },
            authenticatorData: 'SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAAiYcFjK3EuBtuEw3lDcvpYAIM9qUkelTIgYsR3Hsb70hTtW67VxL7uyb5S2oHnVW3nLpQECAyYgASFYIMMYmGch7FZtiYUv9ozzwRxETFTKm_mb98X7AI6g3FEqIlggVgHgBa2euS0jqIXEdvg5h2TZaU2b9MGMOSdDWsQVNio=',
            clientData: 'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiYWY1NDk3MGYtOWJlYi00MjNkLWFmZDUtN2Y1YTMzYjhkMjZmIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==',
            attestationData: 'o2NmbXRjdHBtZ2F0dFN0bXSmY2FsZzn__mNzaWdZAQCdlxjfaQv4c-YAz3UsuRa_rUI7vEt2BrNTq3VqDtG02T-11GrwcAlRNcPTyAkFiLewlMQvIciHLc3LSE8FVTJD5RRpHh-u6PQeRMwj3gUw5rIF2a__wnSxUU5ugsD-gETyybvLuAEpI7W7cj4DbGN8OXgtEvnIi_4YFNEeXSc_V4OPjZVlQEJ3jRef2zJ9uY477_N6PKcRTDkrO95l7WhOMOwvmr0A82P191DTDlEQIpiySTAeB3g7iLKe08JKOCfH3yA0K_u8-va8SVyRL4fw6t85py-nEqvdmLbAYnQWsTAtFRuTI6vJM_CQKwGPF0pVQ19Lu19-uK2K1hGFktRqY3ZlcmMyLjBjeDVjglkFvTCCBbkwggOhoAMCAQICEFueDi_-Xk_ms1i7Bi7PWokwDQYJKoZIhvcNAQELBQAwQjFAMD4GA1UEAxM3RVVTLUlOVEMtS0VZSUQtMzQyMTlCMjFGNDc3RjZDN0Y3OEEwRjI2QjIzRDA0MzBERUVBNDM2MzAeFw0yNDAyMTcwNzM2MTVaFw0yNzA3MTUxNzQ2MzBaMAAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDP92CIr-Ow4lyCtY2Mj2VEN2Q6TbJ46v6Oiep8WbVBcd0Kb0cBG7uMFTJ28BN8CNwNfuAhl_ttv3rll6KKKXrUHJIunthcB4tNfQXDcx1BdQ8HH-YE0x1W__02QFZJf_zKLlhxsXtkgr9JpYlWczkppnixCKkoSBurPYkuPhC4IJQ0RIXRay6WKUJJKTl1MLy1hBFwXD-8bi1ZdXHWmqOYnfxBzloyTY_31tPd2A28S6RIBWM-CW7ZgyNJS3WrZ7VR55N1MS6qcJ62GPmNuHhhRr1T4oTtm4wit1DvAVgYLr3gd55p9LNRnX2xvUvAqD3IrYPvZx1zbQL07uZgJbClAgMBAAGjggHrMIIB5zAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH_BAIwADBtBgNVHSABAf8EYzBhMF8GCSsGAQQBgjcVHzBSMFAGCCsGAQUFBwICMEQeQgBUAEMAUABBACAAIABUAHIAdQBzAHQAZQBkACAAIABQAGwAYQB0AGYAbwByAG0AIAAgAEkAZABlAG4AdABpAHQAeTAQBgNVHSUECTAHBgVngQUIAzBQBgNVHREBAf8ERjBEpEIwQDEWMBQGBWeBBQIBDAtpZDo0OTRFNTQ0MzEOMAwGBWeBBQICDANBREwxFjAUBgVngQUCAwwLaWQ6MDI1ODAwMTIwHwYDVR0jBBgwFoAUNAENcC6kckA61qSw-k7XmqzK8UkwHQYDVR0OBBYEFLVLffJIdEAhsd3RV2SvAlxDhQ5IMIGzBggrBgEFBQcBAQSBpjCBozCBoAYIKwYBBQUHMAKGgZNodHRwOi8vYXpjc3Byb2RldXNhaWtwdWJsaXNoLmJsb2IuY29yZS53aW5kb3dzLm5ldC9ldXMtaW50Yy1rZXlpZC0zNDIxOWIyMWY0NzdmNmM3Zjc4YTBmMjZiMjNkMDQzMGRlZWE0MzYzLzkxZmQ3NDUwLWQ3YjAtNDcxMS1hZjJhLWUzODAwOTE4YjBlOS5jZXIwDQYJKoZIhvcNAQELBQADggIBAGW1XzznuD-DvcKzGnQhVLqnD7IElSlQc0kPo1yloViK6yetUINHlnQIaQHMM6QmKibwHofSbYcMWPjV0q1VJq4LYerFi0brQudMENIDOzQXaEkWhzvD7r1ayKhNBobWREbDBh5SLEARJQXdyciNZdaRqX_5Q6pgN72eXD8Z9dHFPPBgAho2e3iabxki36Q6rkCUEaXjhWq1aBDouUtDeGoMkjQ_nYMKzM40YS_07cv9U2k5laNXFSJe241-EnIVUk7vEmT_0r88ksrBNTMDPkhIHQcSGe3-N48Ydwnmtf0eM2jAgSeajnNripnSI7qbdKWv-nJLJAPQ_wmawU3eZ5hGqJ6HjD0fleu7f_xUpsVd14bc6blbJvzFYFZ0-UrRmDkz-HKS3c5HzKzcLw_suPNbG3ObntuuX0mc_Jg6L1KINLhNWSIJoVtECTn2Xid0MFxDYcO_FjQ9lzjJ4ocwjnGkOtn0gEtf4GWcbam7USVmbXiWJawc9UEN744skllkCokQKDIiNHYTA1pTCjaWsFy9e0-oqu1MWWpSpdDp-yw1TUTQBVhTO-_Gk-3YpnWi9A-AwKlgoWWSw2Ou3BfLTxdlBe6FdXtVryedw-4DVBMd59Td9-M2CNFj1zt-nD4rZzV-uERqzLPFNrxvhE6ZEEVhyfowy5e16TA7OOUp8EDUWQbwMIIG7DCCBNSgAwIBAgITMwAABxYgXHHGr1bDtwAAAAAHFjANBgkqhkiG9w0BAQsFADCBjDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjE2MDQGA1UEAxMtTWljcm9zb2Z0IFRQTSBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDE0MB4XDTIxMDcxNTE3NDYzMFoXDTI3MDcxNTE3NDYzMFowQjFAMD4GA1UEAxM3RVVTLUlOVEMtS0VZSUQtMzQyMTlCMjFGNDc3RjZDN0Y3OEEwRjI2QjIzRDA0MzBERUVBNDM2MzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMPEHn5IKWnqPi7jX6ZxodigyK4wbpN6fi4RFjfYQ9tWooHTNl770aUVKcNQVlroiiVT76McSpB2M_Ntr9nrfSFKJi8HnXgg3pAVOZgv_vWZBmH4wRwufugcPDBDyaTVe3YWBbIydPOtAnyOUOQwUbg5_QLHZgQKAuhjX2rNnZbh7ztanSLT3rFGafZ4BhKI28QlRlKfSwiA4IsPE0BzIKJuHz6MG8HU5A24KPnYnsIaXzLc5rFcrx6tSt361nc8Ukoe0gsDKDTo2gQFwBkiEvWdXh_3H6GsO46lUfNb0mN6Emii7VSh-miGmDumC3P3qZWotySLTEQJDT2bEFBC_sMs1Z_2sQoyBe3NZDjlDPp98_bpY4JQq1Ir19E0MHDq79V3aSGuwZdVBRBp31r1qf8STC9hjK679ChtAs7GNGynntgIxF9hErzDpz98V_GEIcZNiqQrp-26SEnMA_KZNT0xE-Frc4LPUnMmLv5RXEKpmi77UCECwI7PHbAQ9eyTJWanq2Fn9LssXIioTHGWU61pl6YyM_j2mQBmV2v4Unz-nm6uH3ElpaaKVkukms6IZPjBGYdqygH7RN_w4iPNw7coUQJ_J5mVqTtXXbZJiewgkXHwAS-VIz1RkGA298RpxrV2KqJ2zj2SJjtox50YzZqV6U2R2yVyq4Qfd5BNXg8hAgMBAAGjggGOMIIBijAOBgNVHQ8BAf8EBAMCAoQwGwYDVR0lBBQwEgYJKwYBBAGCNxUkBgVngQUIAzAWBgNVHSAEDzANMAsGCSsGAQQBgjcVHzASBgNVHRMBAf8ECDAGAQH_AgEAMB0GA1UdDgQWBBQ0AQ1wLqRyQDrWpLD6TtearMrxSTAfBgNVHSMEGDAWgBR6jArOL0hiF-KU0a5VwVLscXSkVjBwBgNVHR8EaTBnMGWgY6Bhhl9odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQlMjBUUE0lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBBdXRob3JpdHklMjAyMDE0LmNybDB9BggrBgEFBQcBAQRxMG8wbQYIKwYBBQUHMAKGYWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVFBNJTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAxNC5jcnQwDQYJKoZIhvcNAQELBQADggIBAGTbDe45LJIux6HyDXDySAfzdtcvv8XywrCrz1J3ArtoJInkeBXstExTCcO4mYV4DnqSBnkgF-iP38s0TWNUxmxvx00YoPLSDza-GcHj0-Dbu2nnC_49DkRCG3ZUufDIGMVKva-X9pDcQ1NpXtrbMfxj9ZbeU3Ge0rSfj-bZixxsfh73dIRnmuDccRqsa5NczFKRf0YAqP2P3220uqTCcywuGmMvs9-DF5Adc0S48YwcK-4PrIW3RKunVkfBBhVSlL29X0mvWE-eBlNBlAYYBy_kmlXTPNOH1UymUTuQ0DSuc8zYH6ZP-xBqWGkcsRBJmS4WqgQXK9Tx0SdUAWvkdaWilOiAJzAy3SHsh2xV1HSakBzuFxcNbtgVkrkU-6XGEhAjDqy2C1iUsqdb5WacS1PC61JJCh4FKkWE88AoxCSkrWYOA0EhJd4fTwFcy8julr6xrkc-uQl46C-xeaaJ89NIww1fFujfEyP6x-0I_ap8oVA3_e4uPhmRIpDDBw6mnucV8fzZOZ2moxmRErk9LYbG-5U16BuGvRNklsYY5KkT0SYNTYkod0clGfcz8pn7Shmj_SwKBfLfkR_iZGlazXwMlvEYrLx5GSJ-0MelMP8KTM33QVpduDWL_4F8viqQHbwAk5eCKorubVzuvBA1tcoS7TjCfCHqupr5AOoPr3vYZ3B1YkFyZWFYdgAjAAsABAByACCd_8vzbDg65pn7mGjcbcuJ1xU4hL4oA5IsEkFYv60irgAQABAAAwAQACDDGJhnIexWbYmFL_aM88EcRExUypv5m_fF-wCOoNxRKgAgVgHgBa2euS0jqIXEdvg5h2TZaU2b9MGMOSdDWsQVNipoY2VydEluZm9Yof9UQ0eAFwAiAAvpAYXU5JrBYgz9vmRp4r8HJr8b791vU85yuIy6WzEvGQAUc54Lkdi22slPN66gYliUUFAZNRsAAAABFXFmgz3I7v8uY-j8Ach5LuH0kwHdACIACxIg86ll4q9vQpxL7FNsJv3qJ1SOxz4es44qeBq7qWWXACIAC6OPfOU8h2tsQn4Tox-rCqcfA4mxO_z_lcqKChaGlW31aGF1dGhEYXRhWKRJlg3liA6MaHQ0Fw9kdmBbj-SuuaKGMseZXPO6gx2XY0UAAAAACJhwWMrcS4G24TDeUNy-lgAgz2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbeculAQIDJiABIVggwxiYZyHsVm2JhS_2jPPBHERMVMqb-Zv3xfsAjqDcUSoiWCBWAeAFrZ65LSOohcR2-DmHZNlpTZv0wYw5J0NaxBU2Kg=='
        },
        user_id: '66098f1f7482c83a5764faa3',
        user_code: 'admin',
        active: true
    })
      mockPasswordLessService.verifyAuthentication.mockResolvedValue(null);
      // act
      const response = await usecase.execute({
        "credentialId": "z2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbecs",
        "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAg==",
        "clientData": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiYWY1NDk3MGYtOWJlYi00MjNkLWFmZDUtN2Y1YTMzYjhkMjZmIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
        "signature": "MEUCIQDa-WIeK9T_C0q1KzIkw_nUhuauBLall8vnfy8VFipbtQIgd0R-wiMarrfLDnRc2xYvVE15dpVyZlRgY5V-ikEKTcM=",
        "userHandle": "fvOZu20uzcgejAkBvHb8yHydeJFPZAsAMbd_N4dGosk=",
        "user_code": "admin"
      });
      // assert
      expect(response).toEqual(data);
    });

    it('should not found', async () => {
      // arrange
      mockGetUserUsecase.execute.mockRejectedValue(ERRORS.GET_USER_USECASE_USER_NOT_FOUND);
      // act
      let error;
      try {
        await usecase.execute({
          "credentialId": "z2pSR6VMiBixHcexvvSFO1brtXEvu7JvlLagedVbecs",
          "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAg==",
          "clientData": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiYWY1NDk3MGYtOWJlYi00MjNkLWFmZDUtN2Y1YTMzYjhkMjZmIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
          "signature": "MEUCIQDa-WIeK9T_C0q1KzIkw_nUhuauBLall8vnfy8VFipbtQIgd0R-wiMarrfLDnRc2xYvVE15dpVyZlRgY5V-ikEKTcM=",
          "userHandle": "fvOZu20uzcgejAkBvHb8yHydeJFPZAsAMbd_N4dGosk=",
          "user_code": "admin"
        });
      } catch (e) {
        error = e.message;
      }
      // assert
      expect(error).toEqual(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    });

  });
});
