unit Controllers.ProjectController;

interface

uses
  System.SysUtils,
  Models.Project,
  Services.ProjectService,
  Utils.Logger;

type
  TProjectController = class
  private
    FService: TProjectService;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    function CreateProject(const AName: string; AOwnerId: Integer): Boolean;
    function GetAllProjects: TArray<TProject>;
    function StartProject(AProjectId: Integer): Boolean;
    function CompleteProject(AProjectId: Integer): Boolean;
  end;

implementation

constructor TProjectController.Create;
begin
  inherited;
  FService := TProjectService.Create;
  FLogger := TLogger.Create;
end;

destructor TProjectController.Destroy;
begin
  FService.Free;
  FLogger.Free;
  inherited;
end;

function TProjectController.CreateProject(const AName: string; AOwnerId: Integer): Boolean;
begin
  try
    FService.CreateProject(AName, '', AOwnerId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Create project failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TProjectController.GetAllProjects: TArray<TProject>;
begin
  Result := FService.GetAllProjects;
end;

function TProjectController.StartProject(AProjectId: Integer): Boolean;
begin
  try
    FService.StartProject(AProjectId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Start project failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

function TProjectController.CompleteProject(AProjectId: Integer): Boolean;
begin
  try
    FService.CompleteProject(AProjectId);
    Result := True;
  except
    on E: Exception do
    begin
      FLogger.LogError('Complete project failed: ' + E.Message);
      Result := False;
    end;
  end;
end;

end.
